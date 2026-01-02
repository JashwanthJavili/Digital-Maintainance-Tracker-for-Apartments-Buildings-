export const createRequest = async (data: any) => {
  return {
    success: true,
    message: "Maintenance request created successfully",
    data
  };
};

export const getRequestsByResident = async (residentId: number) => {
  return {
    success: true,
    residentId,
    requests: []
  };
};

export const submitFeedback = async (requestId: number, rating: number, comment?: string) => {
  return {
    success: true,
    message: "Feedback submitted successfully",
    requestId,
    rating,
    comment
  };
};
