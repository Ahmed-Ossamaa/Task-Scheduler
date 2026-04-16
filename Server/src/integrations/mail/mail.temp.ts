export const managerWelcomeTemplate = (
  name: string,
  verifyLink: string,
): string =>
  `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Welcome to the Task-Flow, ${name}!</h2>
        <p>Thank you for setting up your workspace. To get started, please verify your email address.</p>
        <div style="margin: 30px 0;">
            <a href="${verifyLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Verify Email Address
            </a>
        </div>
        <p style="color: #6b7280; font-size: 14px;">This link will expire in 24 hours.</p>
    </div>
  `;

export const employeeInviteTemplate = (
  name: string,
  tempPass: string,
  verifyLink: string,
): string =>
  `
    <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px;">
        <h2>Welcome to the Team, ${name}!</h2>
        <p>Your manager has invited you to join the organization workspace.</p>
        <p><strong>Your Temporary Password:</strong> ${tempPass}</p>
        <div style="margin: 30px 0;">
            <a href="${verifyLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Verify Account
            </a>
        </div>
        <p>Please change your password immediately after logging in.</p>
    </div>
  `;

export const resendVerificationTemplate = (
  name: string,
  verifyLink: string,
): string =>
  `
    <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px;">
        <h2>Hello ${name},</h2>
        <p>A new email verification link was requested for your account.</p>
        <div style="margin: 30px 0;">
            <a href="${verifyLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Verify Email Address
            </a>
        </div>
        <p style="color: #6b7280; font-size: 14px;">This link will expire in 24 hours.</p>
    </div>
  `;
