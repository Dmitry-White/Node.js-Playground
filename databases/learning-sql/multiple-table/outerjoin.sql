SELECT ppl.first_name,
    ppl.last_name,
    ppl.state_code,
    st.state_name
FROM states st
    LEFT JOIN people ppl ON st.state_abbrev = ppl.state_code;