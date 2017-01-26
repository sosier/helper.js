# helper.js

Library of javascript helper functions useful across a variety of different project types. Helps make javascript more "pythonic."

## Some Favorites:
 - **log**(text)
   - Logs message to the console
   - Looks for a global show_logs (boolean) constant before printing, allowing to quickly turn on / off all console logging
   - Saves the time writing "console."
 - **len**(item)
 - **int**(item)
 - **str**(item, insert)
 - **send_message**(to, message)
 - ["an", "array"]**.copy**()
 - **deep_copy**(original_object)
 - "a string"**.contains**(sub_string)
 - **sum**(array)
 - **avg**(array)
 - **max**(arguments)
 - **set**(array)
 - **keys**(object)
 - **values**(object)
 - **prefer**(list, next_if=set([undefined, ""]))
 - **array_of**(value, length)
 - **itemwise**(array_a, action, array_b)
 - **bayesian_probability_estimator**(n_observed, n_samples)

More detail on the favorites coming soon...
