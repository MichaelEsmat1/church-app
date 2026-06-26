const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {

    const {
      stage_id,
      name,
      username,
      password,
      role
    } = req.body;

    const email = `${username}@church.local`;

    // Create Auth User
    const { data: authUser, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true
      });

    if (authError)
      throw authError;

    // Insert servant
    const { error: dbError } =
      await supabase
        .from("servants")
        .insert({
          id: "sv_" + Date.now(),
          stage_id,
          name,
          username,
          auth_user_id: authUser.user.id,
          role: role || "خادم"
        });

    if (dbError)
      throw dbError;

    return res.status(200).json({
      success: true
    });

  } catch (e) {

    return res.status(500).json({
      error: e.message
    });

  }
};