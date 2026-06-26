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

    const { id, username } = req.body;

    const { data: servant, error } = await supabase
      .from("servants")
      .select("auth_user_id")
      .eq("id", id)
      .single();

    if (error) throw error;

    const { error: authError } =
      await supabase.auth.admin.updateUserById(
        servant.auth_user_id,
        {
          email: `${username}@church.local`
        }
      );

    if (authError) throw authError;

    return res.status(200).json({
      success: true
    });

  } catch (e) {

    return res.status(500).json({
      error: e.message
    });

  }

};