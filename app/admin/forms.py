from flask_wtf import FlaskForm
from wtforms import DecimalField, DateTimeLocalField, IntegerField, StringField, TextAreaField, SubmitField
from wtforms.validators import DataRequired, Length, NumberRange


class EventCreateForm(FlaskForm):
    title = StringField("Titulo", validators=[DataRequired(), Length(max=200)])
    description = TextAreaField("Descripcion", validators=[DataRequired(), Length(max=2000)])
    date = DateTimeLocalField(
        "Fecha y hora",
        format="%Y-%m-%dT%H:%M",
        validators=[DataRequired()],
    )
    venue = StringField("Venue", validators=[DataRequired(), Length(max=200)])
    image_url = StringField("Imagen", validators=[DataRequired(), Length(max=500)])

    ticket1_name = StringField("Tipo 1 - Nombre", validators=[DataRequired(), Length(max=80)])
    ticket1_price = DecimalField(
        "Tipo 1 - Precio",
        places=2,
        rounding=None,
        validators=[DataRequired(), NumberRange(min=0)],
    )
    ticket1_stock = IntegerField(
        "Tipo 1 - Stock",
        validators=[DataRequired(), NumberRange(min=0)],
    )

    ticket2_name = StringField("Tipo 2 - Nombre", validators=[DataRequired(), Length(max=80)])
    ticket2_price = DecimalField(
        "Tipo 2 - Precio",
        places=2,
        rounding=None,
        validators=[DataRequired(), NumberRange(min=0)],
    )
    ticket2_stock = IntegerField(
        "Tipo 2 - Stock",
        validators=[DataRequired(), NumberRange(min=0)],
    )

    submit = SubmitField("Crear evento")
