UPDATE users set f_name = $1 WHERE uniq_user_id = $2 RETURNING *;