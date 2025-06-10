module.exports = ({ env }) => ({
    email: {
      config: {
        provider: 'nodemailer',
        providerOptions: {
          host: env('SMTP_HOST'), // e.g. smtp.gmail.com
          port: env.int('SMTP_PORT', 587),
          auth: {
            user: env('SMTP_USERNAME'), // your email
            pass: env('SMTP_PASSWORD'), // your email app password
          },
          // optional TLS settings
          secure: false,
          requireTLS: true,
        },
        settings: {
          defaultFrom: env('SMTP_USERNAME'),
          defaultReplyTo: env('SMTP_USERNAME'),
        },
      },
    },
  });
  