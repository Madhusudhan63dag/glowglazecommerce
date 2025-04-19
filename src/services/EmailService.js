import axios from 'axios';

// Use the same API_URL configuration as in other files
const API_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' 
  ? 'https://razorpaybackend-wgbh.onrender.co' 
  : 'http://localhost:5000');

/**
 * Email Service for handling all customer email communications
 */
class EmailService {
  /**
   * Send welcome email to new customers
   * @param {string} email - Customer email address
   * @param {string} name - Customer name
   * @returns {Promise} API response
   */
  static async sendWelcomeEmail(email, name) {
    try {
      const response = await axios.post(`${API_URL}/send-welcome-email`, {
        customerEmail: email,
        customerName: name
      });
      return response.data;
    } catch (error) {
      console.error('Error sending welcome email:', error);
      // Return standardized error response
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send welcome email',
        error: error.message
      };
    }
  }

  /**
   * Send order status update email
   * @param {string} email - Customer email address
   * @param {Object} orderDetails - Order information
   * @param {Object} statusUpdate - Status update details
   * @returns {Promise} API response
   */
  static async sendOrderStatusEmail(email, orderDetails, statusUpdate) {
    try {
      const response = await axios.post(`${API_URL}/send-order-status-email`, {
        customerEmail: email,
        orderDetails,
        statusUpdate
      });
      return response.data;
    } catch (error) {
      console.error('Error sending order status email:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send order status email',
        error: error.message
      };
    }
  }

  /**
   * Send shipment tracking email
   * @param {string} email - Customer email address
   * @param {Object} orderDetails - Order information
   * @param {Object} trackingInfo - Shipping tracking details
   * @returns {Promise} API response
   */
  static async sendShipmentTrackingEmail(email, orderDetails, trackingInfo) {
    try {
      const response = await axios.post(`${API_URL}/send-shipment-tracking-email`, {
        customerEmail: email,
        orderDetails,
        trackingInfo
      });
      return response.data;
    } catch (error) {
      console.error('Error sending shipment tracking email:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send tracking email',
        error: error.message
      };
    }
  }

  /**
   * Send special offer or discount email
   * @param {string} email - Customer email address
   * @param {string} name - Customer name
   * @param {Object} offerDetails - Offer information
   * @returns {Promise} API response
   */
  static async sendSpecialOfferEmail(email, name, offerDetails) {
    try {
      const response = await axios.post(`${API_URL}/send-special-offer-email`, {
        customerEmail: email,
        customerName: name,
        offerDetails
      });
      return response.data;
    } catch (error) {
      console.error('Error sending special offer email:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send special offer email',
        error: error.message
      };
    }
  }

  /**
   * Send review request email after purchase
   * @param {string} email - Customer email address
   * @param {Object} orderDetails - Order information
   * @param {Array} productDetails - Products purchased
   * @returns {Promise} API response
   */
  static async sendReviewRequestEmail(email, orderDetails, productDetails) {
    try {
      const response = await axios.post(`${API_URL}/send-review-request-email`, {
        customerEmail: email,
        orderDetails,
        productDetails
      });
      return response.data;
    } catch (error) {
      console.error('Error sending review request email:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send review request email',
        error: error.message
      };
    }
  }

  /**
   * Send order confirmation email (wrapper for existing API)
   * @param {string} email - Customer email
   * @param {Object} orderDetails - Order information
   * @param {Object} customerDetails - Customer information
   * @returns {Promise} API response
   */
  static async sendOrderConfirmationEmail(email, orderDetails, customerDetails) {
    try {
      const response = await axios.post(`${API_URL}/send-order-confirmation`, {
        customerEmail: email,
        orderDetails,
        customerDetails
      });
      return response.data;
    } catch (error) {
      console.error('Error sending order confirmation email:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send order confirmation email',
        error: error.message
      };
    }
  }

  /**
   * Utility method to handle email failures
   * Stores failed emails locally for retry
   * @param {string} type - Email type
   * @param {Object} data - Email data
   */
  static storeFailedEmailForRetry(type, data) {
    try {
      // Get existing failed emails from localStorage
      const failedEmails = JSON.parse(localStorage.getItem('failedEmails') || '[]');
      
      // Add this email to the list
      failedEmails.push({
        type,
        data,
        timestamp: new Date().toISOString(),
        retryCount: 0
      });
      
      // Store back in localStorage
      localStorage.setItem('failedEmails', JSON.stringify(failedEmails));
      
      console.log(`Stored failed ${type} email for later retry`);
    } catch (error) {
      console.error('Error storing failed email:', error);
    }
  }
  
  /**
   * Retry sending failed emails
   * @returns {Promise<{success: boolean, retriedCount: number, successCount: number}>}
   */
  static async retryFailedEmails() {
    try {
      const failedEmails = JSON.parse(localStorage.getItem('failedEmails') || '[]');
      
      if (failedEmails.length === 0) {
        return { success: true, retriedCount: 0, successCount: 0 };
      }
      
      let successCount = 0;
      const updatedFailedEmails = [];
      
      for (const email of failedEmails) {
        // Skip if max retries reached (5)
        if (email.retryCount >= 5) {
          updatedFailedEmails.push(email);
          continue;
        }
        
        let success = false;
        
        // Try to send based on type
        try {
          switch (email.type) {
            case 'welcome':
              const welcomeResult = await this.sendWelcomeEmail(
                email.data.customerEmail,
                email.data.customerName
              );
              success = welcomeResult.success;
              break;
            case 'orderStatus':
              const statusResult = await this.sendOrderStatusEmail(
                email.data.customerEmail,
                email.data.orderDetails,
                email.data.statusUpdate
              );
              success = statusResult.success;
              break;
            // Add cases for other email types
            default:
              success = false;
          }
          
          if (success) {
            successCount++;
          } else {
            // Increment retry count and keep in the list
            email.retryCount += 1;
            updatedFailedEmails.push(email);
          }
        } catch (error) {
          // Increment retry count and keep in the list
          email.retryCount += 1;
          updatedFailedEmails.push(email);
        }
      }
      
      // Update localStorage with remaining failed emails
      localStorage.setItem('failedEmails', JSON.stringify(updatedFailedEmails));
      
      return { 
        success: true, 
        retriedCount: failedEmails.length, 
        successCount 
      };
    } catch (error) {
      console.error('Error retrying failed emails:', error);
      return { success: false, error: error.message };
    }
  }
}

export default EmailService;
