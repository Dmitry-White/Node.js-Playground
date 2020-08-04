SELECT MAX(quiz_points),
    MAX(CAST(quiz_points AS CHAR)),
    MAX(CAST(quiz_points AS FLOAT))
FROM people;