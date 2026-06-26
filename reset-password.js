require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {

  const { data, error } =
    await supabase.auth.admin.updateUserById(
      "ee979fe3-5206-4e5b-90c4-9df6b0eb500b", // الـ User ID
      {
        password: "123456"
      }
    );

  console.log(data);
  console.log(error);
}

run();