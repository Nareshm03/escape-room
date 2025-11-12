/**
 * Standardized API call handler with logging and toast notifications
 */

export const handleApiCall = async (apiFunction, options = {}) => {
  const {
    successMessage,
    errorMessage = 'Operation failed',
    onSuccess,
    onError,
    toast,
    logContext = {}
  } = options;

  try {
    console.log('API call initiated:', logContext);
    const response = await apiFunction();
    
    console.log('API call successful:', {
      ...logContext,
      status: response.status,
      data: response.data
    });

    if (successMessage && toast) {
      toast.success(successMessage);
    }

    if (onSuccess) {
      onSuccess(response.data);
    }

    return { success: true, data: response.data };
  } catch (error) {
    console.error('API call failed:', {
      ...logContext,
      error: error.message,
      response: error.response?.data,
      status: error.response?.status
    });

    const displayMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.message || 
                          errorMessage;

    if (toast) {
      toast.error(displayMessage);
    }

    if (onError) {
      onError(error);
    }

    return { success: false, error: displayMessage };
  }
};
