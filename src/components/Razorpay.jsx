import Axios from "axios";
import React, { useState } from "react";

function RazorPay() {
  const [userId, setUserId] = useState("");
  const [programId, setProgramId] = useState("");

  // this function will handel payment when user submit his/her money
  // and it will confim if payment is successfull or not
  const handlePaymentSuccess = async (response, data) => {
    try {
      let bodyData = new FormData();

      // we will send the response we've got from razorpay to the backend to validate the payment
      bodyData.append("response", JSON.stringify(response));
      bodyData.append("data", JSON.stringify(data));

      await Axios({
        url: "http://localhost:8000/payment/paymentsuccess",
        method: "POST",
        data: bodyData,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          console.log("Everything is OK!");
          setProgramId(0);
          setUserId(0);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(console.error());
    }
  };

  // this will load a script tag which will open up Razorpay payment card to make //transactions
  const loadScript = () => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);
  };

  const showRazorpay = async () => {
    const res = await loadScript();

    let bodyData = new FormData();

    // we will pass the amount and product name to the backend using form data
    bodyData.append("programId", programId);
    bodyData.append("userId", userId);

    const data = await Axios({
      url: "http://localhost:8000/payment/checkout",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: bodyData,
    }).then((res) => {
      return res;
    });

    // in data we will receive an object from the backend with the information about the payment
    //that has been made by the user

    var options = {
      key_id: "rzp_test_P0KpU2wi1sqrm9", // in react your environment variable must start with REACT_APP_
      key_secret: "2xYnfOIcCBux1TlBRM99Ebvy",
      amount: data.data.payment.amount,
      currency: "INR",
      name: "Qurrit",
      description: "Test teansaction",
      order_id: data.data.payment.id,
      handler: function (response) {
        // we will handle success by calling handlePaymentSuccess method and
        // will pass the response that we've got from razorpay
        handlePaymentSuccess(response, data);
      },
      prefill: {
        name: "User's name",
        email: "User's email",
        contact: "User's phone",
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };

    var rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  return (
    <div className="container" style={{ marginTop: "20vh" }}>
      <form>
        <h1>Payment page</h1>

        <div className="form-group">
          <label htmlFor="name">User ID</label>
          <input
            type="text"
            className="form-control"
            id="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Program ID</label>
          <input
            type="text"
            className="form-control"
            id="programID"
            value={programId}
            onChange={(e) => setProgramId(e.target.value)}
          />
        </div>
      </form>
      <button onClick={showRazorpay} className="btn btn-primary btn-block">
        Pay with razorpay
      </button>
    </div>
  );
}

export default RazorPay;
