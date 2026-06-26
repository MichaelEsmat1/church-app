const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async (req, res) => {

  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  try {

    const { id, password } = req.body;

    const { data: servant } = await supabase
      .from("servants")
      .select("auth_user_id")
      .eq("id", id)
      .single();

    const { error } =
      await supabase.auth.admin.updateUserById(
        servant.auth_user_id,
        {
          password
        }
      );

    if (error) throw error;

    return res.json({ success: true });

  } catch (e) {

    return res.status(500).json({
      error: e.message
    });

  }

};