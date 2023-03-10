const mongoose = import("mongoose");
import("dotenv").config();

export default connect = async () => {
  await mongoose.connect(process.env.MONGO_URI);
};
