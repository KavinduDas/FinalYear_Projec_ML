import os
os.environ["OPENBLAS_NUM_THREADS"] = "1"
os.environ["OMP_NUM_THREADS"] = "1"          # Added After python app.py not worked after docker 
os.environ["MKL_NUM_THREADS"] = "1"          
os.environ["VECLIB_MAXIMUM_THREADS"] = "1"
from flask import Flask, render_template, request , redirect ,url_for , flash , session , jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_wtf import FlaskForm
from wtforms import StringField , PasswordField ,SubmitField
from wtforms.validators import InputRequired , Length , ValidationError
from flask_bcrypt import Bcrypt
from rag import get_query_engine

query_engine = get_query_engine()

app = Flask(__name__)
# query_engine = create_query_engine()

# Before Docker Implementation DB 03/04 2.08pm
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:Kavi%4010140@localhost:5432/Users'
app.config['SECRET_KEY'] = 'thisisasecretkey'
# app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL")
# app.config['SECRET_KEY'] = os.getenv("SECRET_KEY")
bcrypt = Bcrypt(app)

db = SQLAlchemy(app)

class User(db.Model):
    __tablename__ = 'user_management_New'

    username = db.Column(db.String(40), primary_key=True)
    password = db.Column(db.String(200))
    email = db.Column(db.String(40))
    designation = db.Column(db.String(40))

    def __init__(self, username, password, email, designation):
        self.username = username
        self.password = password
        self.email = email
        self.designation = designation

class createuser(FlaskForm):
    username = StringField(validators=[
                           InputRequired(), Length(min=4, max=20)])

    password = PasswordField(validators=[
                             InputRequired(), Length(min=8, max=20)])
    
    email = StringField(validators=[InputRequired(),Length(min=8 , max=20)])
    designation = StringField(validators=[InputRequired(),Length(min=8 , max=20)])

    def validate_username(self, username):
        existing_user_username = User.query.filter_by(
            username=username.data).first()
        if existing_user_username:
            raise ValidationError(
                'That username already exists. Please choose a different one.')

    submit = SubmitField('Register')

class LoginForm(FlaskForm):
    username = StringField(validators=[
                           InputRequired(), Length(min=4, max=20)], render_kw={"placeholder": "Username"})

    password = PasswordField(validators=[
                             InputRequired(), Length(min=8, max=20)], render_kw={"placeholder": "Password"})

    submit = SubmitField('Login')



@app.route('/')
def index():
    return render_template("index.html")

@app.route('/dashboard')
def dashboard():
    return render_template("dashboard.html")


@app.route('/adminPage')
def adminPage():
    Total_users = User.query.order_by(User.username).all()
    return render_template("adminpage.html", Total_users=Total_users)

@app.route("/test")
def test():
    return render_template("test.html")


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']


        user = User.query.filter_by(username=username).first()

        if user:
            if bcrypt.check_password_hash(user.password, password):
                session['username'] = user.username
                return redirect(url_for('index'))
            else:
                flash("Incorrect password", "danger")
        else:
            flash("Username not found", "danger")

    return render_template("login.html")  


@app.route('/submit', methods=['POST','GET'])
def submit():
    if request.method == 'POST':  # Added on 26/02 11pm POST request
        username = request.form['username']
        password = request.form['password']
        email = request.form['email']
        designation = request.form['designation']

        if User.query.filter_by(username=username).first():
            return "Username already exists"

        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

        new_user = User(username, hashed_password, email, designation)
        try:
            db.session.add(new_user)
            db.session.commit()
            return redirect(url_for('adminPage'))
        except Exception as e:
            return f"Database error: {e}"
    else:
        Total_users = User.query.order_by(User.username).all()
        return render_template("adminPage.html",Total_users = Total_users)

chat_history = []

@app.route("/chat", methods=["GET", "POST"])
def chat():
    global chat_history

    if request.method == "POST":
        user_message = request.form["message"]

        response = query_engine.query(user_message)
        ai_response = str(response)

        chat_history.append({
            "user": user_message,
            "ai": ai_response
        })

        return render_template("chat.html", chat_history=chat_history)

    return render_template("chat.html", chat_history=chat_history)




if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)