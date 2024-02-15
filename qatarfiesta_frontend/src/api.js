import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const AxiosfetchActiveEvents = () => {
  return api.get("/api/v1/organizer/active-event/");
};

export const AxiosCreateBooking = (bookingData) => {
  return api.post("/api/stripe/create-booking/", bookingData);
};

export const AxiosChatHistory = (group_name, page) => {
  return api.get(`/api/chat/history/?group_name=${group_name}&page=${page}`);
};

export const AxiosSendMail = (emailData) => {
  return api.post("/api/chat/send-mail/", emailData);
};
