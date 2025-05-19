import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const backendUrl = "localhost";

  const [currentState, setCurrentState] = useState("Login");

  // const onSubmitHandler = async (event) => {
  //   event.preventDefault();
  //   try {
  //     if (currentState === "Sign Up") {
  //       //calling the registration api
  //       const response = await axios.post(backendUrl + "/api/user/register", {
  //         name,
  //         email,
  //         password,
  //       });
  //       if (response.data.success) {
  //         setToken(response.data.token);
  //         localStorage.setItem("token", response.data.token);
  //         toast.success("Signup Successfully");
  //       } else {
  //         toast.error(response.data.message);
  //       }
  //     } else {
  //       //calling the login api
  //       const response = await axios.post(backendUrl + "/api/user/login", {
  //         email,
  //         password,
  //       });
  //       if (response.data.success) {
  //         toast.success("Login Successfully");
  //         setToken(response.data.token);
  //         localStorage.setItem("token", response.data.token);
  //       } else {
  //         toast.error(response.data.message);
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     toast.error(error.message);
  //   }
  // };

  // useEffect(() => {
  //   if (token) {
  //     navigate("/");
  //   }
  // }, [token]);

  return (
    <form
      className="d-flex flex-column align-items-center w-100 mt-5 mx-auto gap-3 border p-3 rounded"
      style={{ maxWidth: "24rem", color: "#1f2937" }}
    >
      <div className="d-inline-flex align-items-center gap-2 mb-2 mt-4">
        <p className="fs-3 fw-normal">{currentState}</p>
        <hr
          className="border-0"
          style={{ height: "1.5px", width: "2rem", backgroundColor: "#1f2937" }}
        />
      </div>

      {currentState === "Login" ? null : (
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          className="form-control"
          placeholder="Name"
          required
        />
      )}

      <input
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        type="email"
        className="form-control"
        placeholder="Email"
        autoComplete="username"
        required
      />

      <input
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        type="password"
        className="form-control"
        placeholder="Password"
        autoComplete="current-password"
        required
      />

      <div className="w-100 d-flex justify-content-between small mt-n2">

        {currentState === "Login" ? (
          <p
            onClick={() => setCurrentState("Sign Up")}
            className="text-decoration-underline cursor-pointer"
          >
            Create Account
          </p>
        ) : (
          <p
            onClick={() => setCurrentState("Login")}
            className="text-decoration-underline cursor-pointer"
          >
            Login Here
          </p>
        )}
      </div>

      <button className="btn btn-dark fw-light px-4 py-2 mt-3">
        {currentState === "Login" ? "Sign In" : "Sign Up"}
      </button>
    </form>
  );
};

export default Login;
