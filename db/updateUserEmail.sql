UPDATE users set email = $1 WHERE uniq_user_id = $2 RETURNING *