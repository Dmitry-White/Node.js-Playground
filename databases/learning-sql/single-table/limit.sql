SELECT first_name,
    last_name,
    company
FROM people
WHERE company LIKE "%LLC"
LIMIT 10;