import express from "express";
import  jwt  from "jsonwebtoken";
import { User} from "../models/users.js";
import randomstring from "randomstring";
import { Url } from "../models/taskUrl.js";

const router = express.Router();

router.post("/addurl", async (req, res) => {
  try {
    const { title, longurl } = req.body;
    const URL = process.env.URL

    if (!title && !longurl) {
      return res.status(400).json({ Message: "Required data error" })
    }
    const token = await req.headers["x-auth-token"];
    const decode = jwt.verify(token, process.env.SECRET_KEY)
    console.log(decode)
    const user = await User.findById(decode.id)
    // console.log(user)
    const ShortId = randomstring.generate(5);
    // console.log(ShortId)

    const shorturl = `${URL}/${ShortId}`;
    // console.log(shorturl)

    const newUrl = new Url({
      title,
      longurl,
      shorturl,
      shortid: ShortId,
      user: user._id
    })
    await newUrl.save();

    return res.status(200).json({ Message: " Url Shortening completed successfully" })
  }
  catch (error) {
    return res.status(500).json({ Message: "Internal server error" })
  }
})

router.post("/click", async (req, res) => {
  try {
    const { shorturl } = req.body;
    const url = await Url.findOne({ shorturl });
    url.clicks = url.clicks + 1;
    await Url.findByIdAndUpdate(url._id, url);
    return res.status(200).json({ Message: "Url click count updated" })
  }
  catch (err) {
    return res.status(500).json(err);
  }
})

router.get("/getuser", async (req, res) => {
  try {
    const token = await req.headers["x-auth-token"];
    const decode = jwt.verify(token, process.env.SECRET_KEY)
    // console.log(decode)
    const Currentuser = await User.findById(decode.id)
    // console.log(Currentuser)
    const urlDatas = await Url.find({ user: Currentuser._id });
    // console.log(urlDatas)
    if (urlDatas) {
      return res.status(200).json(urlDatas)
    } else {
      return res.status(400).json({ Message: "Data not found/Short url not created yet" })
    }
    
  }
  catch (err) {
    return res.status(500).json({ Message: "Internal server error", err })
  }
})

router.get("/:id",async (req, res) => {
  const id = req.params.id;
  try {
    const urlData = await Url.findOne({ shortid: id });
    // urlData.clicks = urlData.clicks + 1;
    // await Url.findByIdAndUpdate(urlData._id, urlData);
    res.redirect(urlData.longurl);
    console.log(urlData.longurl)
  } catch (error) {
    console.error(error);
    return res.status(500).json({ Message: "Internal server error", err })
  }
})



export const taskUrlRouter = router;