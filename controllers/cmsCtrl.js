const { response } = require("express");
const CMS = require("../models/cms");

exports.view = async (req, res, next) => {
  const req_slug = req.params.slug;

  try {


    // let content = await CMS.findByPk(req_slug);
    // let content = await CMS.findAll();

    // return res.json({ msg: "slug Fetched",content });


    const content_pages = await CMS.findOne({
      where: { slug: req_slug },
    });

    if (!content_pages) {
      return res.json({
        status: "failed",
        msg: "no slug matched",
      });
    }

    res.json({ status: "success", msg: "slug Fetched", content_pages });
  }catch (error) {
    console.log(error);
  }

}




