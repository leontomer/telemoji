import axios from "axios";


export const findUser = (email) => async (dispatch) => {
    try {
      const res = await axios.get("/api/users/finduser",{
        params: {
            email: email
          }
      });
    
      return res.data.other;

    } catch (err) {
      console.log(err);
    }
  };
  