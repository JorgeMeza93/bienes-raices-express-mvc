import nodemailer from "nodemailer"

const emailRegistro = async (datos) => {
    var transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      });
      const { nombre, apellido, email, token} = datos;
      //Enviar el email
      await transport.sendMail({
        from: "Bienes Raíces Pipo",
        to: email,
        subject: "Confirma tu cuenta en Bienes Raíces pipo",
        text: "Confirma tu cuenta en Bienes Raíces pipo",
        html: `<p>Hola ${nombre} ${apellido} comprueba tu cuenta en Bienes Raices Pipo</p>
                <p>Tu cuenta está lista, solo debes confirmarla en el siguiente enlace: 
                    <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000 }/auth/confirmar/${token}">Confirmar Cuenta</a>
                </p>
                <p>Si tú no has creado esta cuenta puedes ignorar el mensaje</p>
        `
      })
}

const emailOlvidePassword = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      });
      const { nombre, apellido, email, token} = datos;
      //Enviar el email
      await transport.sendMail({
        from: "Bienes Raíces Pipo",
        to: email,
        subject: "Restablece tu password en Bienes Raíces pipo",
        text: "Restablece tu password en Bienes Raíces pipo",
        html: `<p>Hola ${nombre} ${apellido} restablece tu password en Bienes Raices Pipo</p>
                <p>Has solicitado reestablecer tu password da click en el siguiente enlace para hacerlo: 
                    <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000 }/auth/olvide-password/${token}">Restablecer Password</a>
                </p>
                <p>Si tú no has solicitado el cambio puedes ignorar el mensaje</p>
        `
      })
}

export { emailRegistro, emailOlvidePassword }