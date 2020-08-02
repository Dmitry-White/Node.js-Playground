SELECT ppl.first_name,
    ppl.state_code,
    st.division
FROM people ppl
    JOIN states st ON ppl.state_code = st.state_abbrev
WHERE ppl.first_name LIKE 'J%'
    AND st.region = 'South';