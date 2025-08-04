import nodemailer from "nodemailer";

export const mailSender = (order) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  var mailOptions = {
    from: process.env.EMAIL_USER,
    to: order.user.email,
    subject: `Order ${order._id} is being processed`,
    html: `
    <html>
      <head>
        <style>
        table {
          border-collapse: collapse;
          max-width:35rem;
          width: 100%;
        }
        th, td{
          text-align: left;
          padding: 8px;
        }
        th{
          border-bottom: 1px solid #dddddd;
        }
        </style>
      </head>
      <body>
        <h1>Order Payment Confirmation</h1>
        <p>Dear ${order.name},</p>
        <p>Thank you for choosing us! Your order has been successfully paid and is now being processed.</p>
        <p><strong>Tracking ID:</strong> ${order._id}</p>
        <p><strong>Order Date:</strong> ${order.createdAt
          .toISOString()
          .replace("T", " ")
          .substr(0, 16)}</p>
          <h2>Order Details</h2>
          <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Unit Price</th>
              <th>Quantity</th>
              <th>Total Price</th>
            </tr>
          </thead>
          <tbody>
          ${order.items
            .map(
              (item) =>
                `
              <tr>
              <td>${item.food.name}</td>
              <td>$${item.food.price}</td>
              <td>${item.quantity}</td>
              <td>$${item.price.toFixed(2)}</td>
              </tr>
              `
            )
            .join("\n")}
            </tbody>
            <tfoot>
            <tr>
            <td colspan="3"><strong>Total:</strong></td>
            <td>$${order.TotalPrice}</td>
            </tr>
            </tfoot>
            </table>
            <p><strong>Shipping Address:</strong> ${order.address}</p>
          </body>
        </html>
  
      `,
    text: "your order details",
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
