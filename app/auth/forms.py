from flask_wtf import FlaskForm
from wtforms import PasswordField, StringField, SubmitField
from wtforms.validators import DataRequired, Email, EqualTo, Length


class RegistrationForm(FlaskForm):
    name = StringField("Nombre", validators=[DataRequired(), Length(max=120)])
    email = StringField("Correo", validators=[DataRequired(), Email(), Length(max=255)])
    password = PasswordField("Contrasena", validators=[DataRequired(), Length(min=6, max=128)])
    confirm_password = PasswordField(
        "Confirmar contrasena",
        validators=[DataRequired(), EqualTo("password", message="Las contrasenas no coinciden")],
    )
    submit = SubmitField("Crear cuenta")


class LoginForm(FlaskForm):
    email = StringField("Correo", validators=[DataRequired(), Email(), Length(max=255)])
    password = PasswordField("Contrasena", validators=[DataRequired(), Length(min=6, max=128)])
    submit = SubmitField("Ingresar")
