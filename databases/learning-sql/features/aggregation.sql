SELECT team,
    COUNT(*),
    MIN(quiz_points),
    MAX(quiz_points),
    SUM(quiz_points),
    AVG(quiz_points)
FROM people
GROUP BY team;