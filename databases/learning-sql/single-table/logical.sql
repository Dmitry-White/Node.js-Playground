SELECT first_name,
    last_name,
    shirt_or_hat,
    state_code
FROM people
WHERE state_code = "CA"
    OR (
        state_code = "CO"
        AND shirt_or_hat = "shirt"
    );