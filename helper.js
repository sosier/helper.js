// ----------------------------------------------------------------------------
// helper.js
// ----------------------------------------------------------------------------

// To-Do's:
//  - Group functions into logical groups
//  - Clean up and document all fuctions

// Console Functions
var log = function(text) {
  /*
  Logs message to the console
  Looks for a global show_logs (boolean) constant before printing
  Saves the time writing "console."

  IN:
    text = String to log to javascript console
  */

  if (show_logs) {
    console.log(text);
  }
};

// Chrome Extension Messaging Functions
var send_message = function(to, message) {
  if (to == "background") {
    message.to = to;
    message.from = _THIS_SCRIPT;
    chrome.runtime.sendMessage(message);
    log("Sent message: " + message.message);
  }
  else if (to == "popup") {
    message.to = to;
    message.from = _THIS_SCRIPT;
    chrome.runtime.sendMessage(message);
    log("Sent message: " + message.message);
  }
  else {
    message.to = to;
    message.from = _THIS_SCRIPT;
    chrome.tabs.sendMessage(to, message);
    log("Sent message: " + message.message);
  }
};

var get = function(what, _from="background") {
  send_message(_from, {"message": "GET", "what": what});
};

// String Functions
var to_title_case = function(str) {
  /*
  IN:
    str = String to convert to title case

  OUT:
    String in title case, e.g. "This Is A String In Title Case"

  EXAMPLES:
    "this is a string in title case" --> "This Is A String In Title Case"
    "THIS IS A STRING IN TITLE CASE" --> "This Is A String In Title Case"
  */
  return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

// HTML Functions
var generate_link = function(url, text) {
  return "<a href=\"" + url + "\">" + text + "</a>";
};

// URL Functions
var remove_url_protocol = function(url) {
  var url_without_protocol = remove_left(url, url.indexOf("//") + 2);

  return url_without_protocol;
};

var extract_domain = function(url) {
  // Source: http://stackoverflow.com/questions/8498592/extract-root-domain-name-from-string
  var domain;
  //find & remove protocol (http, ftp, etc.) and get domain
  if (url.indexOf("://") > -1) {
      domain = url.split('/')[2];
  }
  else {
      domain = url.split('/')[0];
  }

  //find & remove port number
  domain = domain.split(':')[0];

  return domain;
};

var extract_top_level_domain = function(string, from="url") {
  switch (from) {
    case "domain":
      var domain_parts = string.split(".");
      var num_domain_parts = len(domain_parts);

      if (len(domain_parts[num_domain_parts-1]) == 2 &&
          len(domain_parts[num_domain_parts-2]) == 2) {
        var top_level_domain = last(domain_parts, 3).join(".");
      }
      else {
        var top_level_domain = last(domain_parts, 2).join(".");
      }

      return top_level_domain;
      break;

    case "url":
      return extract_top_level_domain(extract_domain(string), "domain");
      break;
  }
};

// JQuery Functions
var get_jquery_selector = function(jquery_object) {
  var path = [];

  // The element itself
  var element = lower(jquery_object.get(0).tagName)
  var id = jquery_object.attr("id");
  var _class = jquery_object.attr("class");
  if (_class) {
    _class = replace_all(_class, " ", ".");
  }
  path.push(element + (id ? "#" + id : (_class ? "." + _class: "")));

  // Element's parents
  $.each(jquery_object.parents(), function(index, value) {
      var element = lower($(value).get(0).tagName)
      var id = $(value).attr("id");
      var _class = $(value).attr("class");
      if (_class) {
        _class = replace_all(_class, " ", ".");
      }
      path.push(element + (id ? "#" + id : (_class ? "." + _class: "")));
  });

  var slice_end = 0;
  while (!path[slice_end].includes("#") && slice_end < len(path)) {
    slice_end += 1;
  }
  if (slice_end != len(path)) {
    slice_end += 1;
  }
  return path.slice(0,slice_end).reverse().join(">");
};

jQuery.fn.extend({
  exists: function() {
    return this.length > 0;
  },
  outerHTML: function() {
    try {
      return this[0].outerHTML;
    } catch(error) {
      return undefined;
    }
  }
});

var deep_unbind = function(jquery_object) {
  jquery_object.off();
  $.each(jquery_object.children(), function(index, value) {
    deep_unbind($(value));
  });
};

var deep_copy = function(original_object) {
  return jQuery.extend(true, {}, original_object);
};

// Python-ification / My custom JS functions
var len = function(item) {
  return item.length;
};

var is_number = function(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

var int = function(item) {
  return parseInt(item);
};

var str = function(item, insert) {
  item = String(item);

  if (insert != undefined) {

    if (typeof(insert) == "object") {
      var i = 0;
      item = item.replace(/%s/g, function() {
          return str(insert[i++]);
      });
    } else {
      item = replace_all(item, "%s", str(insert));
    }

  }

  return item;
};

String.prototype.contains = function(sub_string) { return this.indexOf(sub_string) != -1; };

var starts_with = function(string, substring) {
  return string.indexOf(substring) == 0;
};

var starts_with_any = function(string, substrings) {
  for (var i=0; i<len(substrings); i++) {
    if (starts_with(string, substrings[i])) {
      return true;
    }
  }
  return false;
}

var ends_with = function(string, substring) {
  return substring == right(string, len(substring));
};

var ends_with_any = function(string, substrings) {
  for (var i=0; i<len(substrings); i++) {
    if (ends_with(string, substrings[i])) {
      return true;
    }
  }
  return false;
}

var lower = function(string) {
  return string.toLowerCase();
};

var upper = function(string) {
  return string.toUpperCase();
};

var replace_all = function(string, replace, replacement) {
  if (typeof(replace) == "object") {
    for (var i in replace) {
      if (string.includes(replace[i])) {
        string = string.split(replace[i]).join(replacement);
      }
    }
  } else {
    if (string.includes(replace)) {
      string = string.split(replace).join(replacement);
    }
  }
  return string;
};

var left = function(string, numberOfCharacters) {
  //LEFT = Return desired # of characters from left of string
  return string.substring(0, numberOfCharacters);
};

var right = function(string, numberOfCharacters) {
  //RIGHT = Return desired # of characters from right of string
   return string.substring(string.length - numberOfCharacters, string.length);
};

var remove_left = function(string, numberOfCharacters) {
  //REMOVELEFT = Remove desired # of characters from left of string
   return string.substring(numberOfCharacters, string.length);
};

var remove_right = function(string, numberOfCharacters) {
  //REMOVERIGHT = Remove desired # of characters from right of string
   return string.substring(0, string.length - numberOfCharacters);
};

var remove_middle = function(string, startPoint, numberOfCharacters) {
  //REMOVEMIDDLE = Remove desired # of characters from the middle of string
   var stringToReturn = left(string, startPoint -1) + remove_left(string, startPoint - 1 + numberOfCharacters);
   return stringToReturn;
};

var insert_middle = function(string, startPoint, stringToInsert) {
  //INSERTMIDDLE = Insert string into desired location in the middle of a string
   var stringToReturn = left(string, startPoint -1) + stringToInsert + remove_left(string, startPoint - 1);
   return stringToReturn;
};

var replace_middle = function(string, startPoint, numberOfCharacters, stringToInsert) {
  //REPLACEMIDDLE = Insert string into desired location in the middle of a string
   var stringToReturn = remove_middle(string, startPoint, numberOfCharacters);
   stringToReturn = insert_middle(stringToReturn, startPoint, stringToInsert);
   return stringToReturn;
};

var remove_all = function(string, to_remove) {
  //REMOVEALL = Removes all occurances of a substring from a full string
  if (typeof(to_remove) == "object") {
    for (var i in to_remove) {
      if (string.includes(to_remove[i])) {
        string = string.split(to_remove[i]).join("");
      }
    }
  } else {
    if (string.includes(to_remove)) {
      string = string.split(to_remove).join("");
    }
  }
  return string;
};

var trim = function(string, what_to_trim=" ") {
  while (starts_with(string, what_to_trim)) {
    string = remove_left(string, len(what_to_trim));
  }
  while (ends_with(string, what_to_trim)) {
    string = remove_right(string, len(what_to_trim));
  }
  return string;
};

var clean_punctuation = function(string, punctuation="!^&*(){}[]:;,.?") {
  //CLEANPUNCTUATION = Removes excess punctuation from string, leaves punctuation that are part of words (e.g. ', &, $, etc.)
  punctuation = punctuation.split("")
  for (var i in punctuation) {
    var mark = punctuation[i];
    string = remove_all(string, mark);
  }
  return string;
};

var words = function(string, clean_string=true) {
  if (clean_string) {
      string = clean_punctuation(string);
      string = string.trim();
      string = string.toLowerCase();
  }

  return string.split(" ");
};

var word = function(string, i, clean_string=true) {
  //WORD = Returns nth word from string
   return words(string, clean_string)[i];
};

var sum = function(array) {
  return array.reduce(function(a, b) {
      return a + b;
    }, 0);
};

var avg = function(array) {
  return sum(array) / len(array);
};

var max = function() {
  return Math.max(...arguments);
};

var random_between = function(low, high) {
  //RANDOMBETWEEN = Returns random integer between (and including specified bounds)
    return floor( random(low, high+1) );
};

Array.prototype.copy = function() {
  var new_array = [];
  return new_array.concat(this);
};

Array.prototype.remove = function(_from, to="") {
  var start = _from;
  var delete_count = 1;

  if (_from < 0) {
    start = len(this) + _from;
  }

  if (to != "") {
    var delete_count = max((to - _from), (_from - to)) + 1;
  }

  return this.splice(start, delete_count);
};

Array.prototype.move_to_start = function(i) {
  var temp = this[i];
  this.remove(i);
  return this.unshift(temp);
};

var first = function(array, n=1) {
  if (n > 0) {
    var result = [];

    for (var i=0; i<n; i++) {
      result.push(array[i]);
    }

    return result;
  }
};

var last = function(array, n=1, reverse=false) {
  if (n > 0) {
    var result = [];

    if (reverse) {
      for (var i=1; i<=n; i++) {
        result.push(array[len(array) - i]);
      }
    }
    else {
      for (var i=len(array) - n; i<len(array); i++) {
        result.push(array[i]);
      }
    }

    return result;
  }
};

var range = function(_from, to="", by=1) {
  var result = [];

  if (to == "") {
    var i = 0;
    while (i < _from) {
      result.push(i);
      i += by;
    }
  }
  else {
    var i = _from;
    while (i < to) {
      result.push(i);
      i += by;
    }
  }

  return result;
};

var array_to_list_of_objects = function(array) {
  var loo = [];

  for (var i=0; i<len(array); i++) {
    loo.push({"index": i,
              "value": array[i]});
  }

  return loo;
};

var set = function(list) {
  var _set = {}

  if (list) {

    if (typeof(list) == "object") {
      for (var i in list) {
        _set[list[i]] = true;
      }
    } else {
      _set[list] = true;
    }

  }

  return _set;
};

var add_to_set = function(set, list) {
  if (list) {

    if (typeof(list) == "object") {
      for (var i in list) {
        set[list[i]] = true;
      }
    } else {
      set[list] = true;
    }

  }

  return set;
};

var remove_from_set = function(set, list) {
  if (list) {

    if (typeof(list) == "object") {
      for (var i in list) {
        delete set[list[i]];
      }
    } else {
      delete set[list];
    }

  }

  return set;
}

var all_in = function(items, in_set) {
  for (var i=0; i<len(items); i++) {
    if ( !(items[i] in in_set) ) {
      return false;
      break;
    }
  }

  return true;
};

var any_in = function(items, in_set) {
  for (var i=0; i<len(items); i++) {
    if (items[i] in in_set) {
      return true;
      break;
    }
  }

  return false;
};

var keys = function(object) {
  return Object.keys(object);
}

var values = function(object) {
  return Object.values(object);
};

var max_item_from_counter = function(counter) {
  var result;
  var max_count = 0;
  $.each(counter, function(key, count) {
    if (count > max_count) {
      result = key;
      max_count = count;
    }
    else if (count == max_count) {
      if (typeof(result) == "object") {
        result.push(key);
      } else {
        result = [result, key];
      }
    }
  });
  return result;
}

var counter_n = function(counter) {
  var n = 0;
  for (key in counter) {
    n += counter[key];
  }
  return n;
};

var avg_from_counter = function(counter) {
  var numbers = keys(counter);

  var counts = [];
  for (var i=0; i<len(numbers); i++) {
    counts.push(counter[numbers[i]]);
  }

  return sum_product(numbers, counts) / sum(counts);
};

var prefer = function(list, next_if=set([undefined, ""])) {
  for (var i in list) {
    if (typeof(list[i]) == "number" ||
        !(list[i] in next_if) ||
        i == len(list) - 1) {
      return list[i];
    }
  }
};

var factorial = function(x) {
  if (x < 0) {
    return undefined;
  }
  else if (x == 0) {
    return 1;
  }
  else {
    var fact = 1;
    for(var n = 2; n <= x; n++) {
      fact *= n;
    }
    return fact;
  }
};

var sqrt = function(x) {
  return Math.sqrt(x);
};

var log2 = function(x) {
  return Math.log(x) / Math.log(2);
};

var n_choose_k = function(n, k) {
  if (n >= k) {
    return factorial(n) / (factorial(k) * factorial(n - k));
  }
};

var array_of = function(value, length) {
  var array = [];

  for (var i=0; i<length; i++) {
    array.push(value);
  }

  return array;
};

var itemwise = function(array_a, action, array_b) {
  var result = [];

  array_a = typeof(array_a) == "object" ? array_a : [array_a];
  array_b = typeof(array_b) == "object" ? array_b : [array_b];

  var longest_array_length = max(len(array_a), len(array_b));

  for (var i=0; i < longest_array_length; i++) {
    var i_a = i % len(array_a);
    var i_b = i % len(array_b);

    switch (action) {
      case "+":
        result.push(array_a[i_a] + array_b[i_b]);
        break;

      case "-":
        result.push(array_a[i_a] - array_b[i_b]);
        break;

      case "*":
        result.push(array_a[i_a] * array_b[i_b]);
        break;

      case "/":
        result.push(array_a[i_a] / array_b[i_b]);
        break;

      case "**":
        result.push(Math.pow(array_a[i_a], array_b[i_b]));
        break;

      case "==":
        result.push(array_a[i_a] == array_b[i_b]);
        break;

      case "!=":
        result.push(array_a[i_a] != array_b[i_b]);
        break;

      case "<=":
        result.push(array_a[i_a] <= array_b[i_b]);
        break;

      case ">=":
        result.push(array_a[i_a] >= array_b[i_b]);
        break;

      case "<":
        result.push(array_a[i_a] < array_b[i_b]);
        break;

      case ">":
        result.push(array_a[i_a] > array_b[i_b]);
        break;

      case "&&":
        result.push(array_a[i_a] && array_b[i_b]);
        break;

      case "and":
        result.push(array_a[i_a] && array_b[i_b]);
        break;

      case "||":
        result.push(array_a[i_a] || array_b[i_b]);
        break;

      case "or":
        result.push(array_a[i_a] || array_b[i_b]);
        break;

    }
  }
  return result;
};

var normalize = function(array) {
  return itemwise(array, "/", sum(array));
};

var sum_product = function(array_a, array_b) {
  if (len(array_a) ==  len(array_b)) {
    return sum(itemwise(array_a, "*", array_b));
  }
};

var expected_value = function(outcomes, probabilities) {
  if (len(outcomes) == len(probabilities) &&
      sum(probabilities) >= 0.99999 &&
      sum(probabilities) <= 1.00001) {
    return sum_product(outcomes, probabilities);
  }
};

var bayesian_probability_estimator = function(n_observed, n_samples) {
  n_observed = prefer([n_observed, 0]);

  var probabilities = [0.00001, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.99999];
  var one_minus_probs = itemwise(1, "-", probabilities);
  var prior_distribution = array_of(1/len(probabilities), len(probabilities));

  var likelihood = itemwise(itemwise(probabilities,
                                     "**",
                                     n_observed),
                            "*",
                            itemwise(one_minus_probs,
                                     "**",
                                     n_samples - n_observed));

  var posterior_distribution = itemwise(prior_distribution, "*", likelihood);
  var normalized_posterior = normalize(posterior_distribution);

  return expected_value(probabilities, normalized_posterior);
};

var RMSE = function(predictions, actual) {
  return sqrt( // Root / Squreroot
          avg( // Mean / Average
            itemwise(  // Squared
              itemwise(actual, "-", predictions), // Error / Residual
              "**",
              2)
            )
          );
};

var accuracy = function(predictions, actual) {
  return avg(itemwise(predictions, "==", actual));
};
