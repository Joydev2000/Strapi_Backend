'use strict';

/**
 * contact-form controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::contact-form.contact-form', ({ strapi }) => ({
  async create(ctx) {
    try {
      // Extract data from request body
      const { FullName, Number, Email, Message } = ctx.request.body;

      // Validate required fields
      if (!FullName || !Email || !Message) {
        return ctx.badRequest('Missing required fields: FullName, Email, and Message are required');
      }

      // Create the contact form entry
      const entry = await strapi.entityService.create('api::contact-form.contact-form', {
        data: {
          Name: FullName,
          Number: Number || '',
          email: Email,
          message: Message,
        },
      });

      // Send email notification to admin
      try {
        await strapi.plugins['email'].services.email.send({
          to: process.env.ADMIN_EMAIL || 'admin@example.com',
          from: process.env.SMTP_USERNAME || 'noreply@example.com',
          subject: 'New Contact Form Submission',
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${FullName}</p>
            <p><strong>Email:</strong> ${Email}</p>
            <p><strong>Phone:</strong> ${Number || 'Not provided'}</p>
            <p><strong>Message:</strong></p>
            <p>${Message}</p>
            <hr>
            <p><small>Submitted at: ${new Date().toLocaleString()}</small></p>
          `,
        });

        // Send confirmation email to user
        await strapi.plugins['email'].services.email.send({
          to: Email,
          from: process.env.SMTP_USERNAME || 'noreply@example.com',
          subject: 'Thank you for contacting us!',
          html: `
            <h2>Thank you for your message!</h2>
            <p>Hi ${FullName},</p>
            <p>We have received your message and will get back to you as soon as possible.</p>
            <p><strong>Your message:</strong></p>
            <p>${Message}</p>
            <br>
            <p>Best regards,<br>Your Team</p>
          `,
        });

        console.log('Emails sent successfully');
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Don't fail the entire request if email fails
      }

      // Return success response
      ctx.body = {
        message: 'Contact form submitted successfully! We will get back to you soon.',
        data: entry
      };

    } catch (error) {
      console.error('Contact form submission error:', error);
      return ctx.internalServerError('Failed to submit contact form');
    }
  },
}));
