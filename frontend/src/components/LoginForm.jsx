import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const validate = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      newErrors.email = "Invalid email address.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      dispatch(login({ email, password }));
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-[90%] sm:w-[70%] md:w-[50%] lg:w-[35%] p-4 bg-white shadow-md rounded font-mono"
      >
        <img
          src="/greet1.ico"
          alt="greet"
          className="h-16 w-16 sm:h-20 sm:w-20 mx-auto rounded-3xl"
        />
        <h2 className="text-xl sm:text-2xl m-4 w-fit mx-auto">Welcome Back!</h2>

        <div className="mb-4">
          <label className="block mb-2 text-sm sm:text-base">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full p-2 border rounded ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            required
          />
          {errors.email && (
            <p className="text-red-500 text-xs sm:text-sm mt-1">
              {errors.email}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm sm:text-base">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full p-2 border rounded ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
            required
          />
          {errors.password && (
            <p className="text-red-500 text-xs sm:text-sm mt-1">
              {errors.password}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full p-2 bg-[#514B96] text-white rounded text-sm sm:text-base"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
