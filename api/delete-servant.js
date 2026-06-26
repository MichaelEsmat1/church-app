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

    const { id } = req.body;

    const { data: servant, error } = await supabase
      .from("servants")
      .select("auth_user_id")
      .eq("id", id)
      .single();

    if (error) throw error;

    // حذف الـ Auth User
    if (servant.auth_user_id) {

      const { error: authError } =
        await supabase.auth.admin.deleteUser(
          servant.auth_user_id
        );

      if (authError) throw authError;

    }

    // حذف من جدول servants
    const { error: dbError } = await supabase
      .from("servants")
      .delete()
      .eq("id", id);

    if (dbError) throw dbError;

    return res.status(200).json({
      success: true
    });

  } catch (e) {

    return res.status(500).json({
      error: e.message
    });

  }

};