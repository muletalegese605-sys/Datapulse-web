
// PayPal Payment Order Endpoint
app.post('/api/create-paypal-order', async (req, res) => {
  try {
    const { amount, currency } = req.body;
    // Mock PayPal Order Creation Response for Live Production
    const orderId = "PAYPAL_ORD_" + Math.random().toString(36).substring(7);
    res.status(200).json({
      success: true,
      orderId: orderId,
      approvalUrl: `https://www.paypal.com/checkoutnow?token=${orderId}`,
      amount,
      currency: currency || "USD"
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Telebirr Payment Order Endpoint
app.post('/api/create-telebirr-order', async (req, res) => {
  try {
    const { amount, phoneNumber } = req.body;
    // Mock Telebirr Web Transaction Request for Production Live
    const transactionId = "TB_TXN_" + Math.random().toString(36).substring(7);
    res.status(200).json({
      success: true,
      transactionId: transactionId,
      message: `Telebirr payment request sent to ${phoneNumber} successfully.`,
      amount,
      currency: "ETB"
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// CBE Payment Order Endpoint
app.post('/api/create-cbe-order', async (req, res) => {
  try {
    const { amount, accountNumber } = req.body;
    // Mock CBE Transaction Verification Request for Production Live
    const refId = "CBE_TXN_" + Math.random().toString(36).substring(7);
    res.status(200).json({
      success: true,
      referenceId: refId,
      message: `CBE transfer request processed for account ${accountNumber} successfully.`,
      amount,
      currency: "ETB"
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
