var express=require("express");
var path=require("path");
var mysql=require("mysql");
//var bodyparser=require("bodyparser");
var multer=require("multer");
var app = express();
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");

//var multer = require("multer");
//var path = require("path");
var randomstring = require("randomstring");
var util = require("util");
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "fincrux@3",
    database: "arvind"
  });
connection.connect(function(error)
{
    if(error) throw error;
    console.log("good database connected");
});
connection.query = util.promisify(connection.query);
var app=express();
app.use(bodyParser.urlencoded({ extended: false }));
//var path = require("path");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: "jhfhfuf" }));
var path = require("path");
app.use(express.static("upload"));
app.set("view engine", "ejs");
// register .html as an engine in express view system

app.get("/", function(req, res) {
    res.redirect("/colleges");
  });
  app.get("/colleges", function(req, res) {
    getcolleges(function(results) {
      res.render("colleges", {results_clg: results});
    });
  });
  
  app.post("/colleges", function(req, res) {
    console.log(req.body);
    var post1 = {
      college_name: req.body.college_name,
      Address: req.body.Address
    };
    var query = connection.query("INSERT INTO college SET ?", post1, function(
      error,
      results,
      fields
    ) {
      if (error) throw error;
      res.send("Submited");
    });
  });

app.put("/colleges", function(req, res) {
    console.log(req.body);
    var college_id = req.body.college_id;
    var post1 = {
      college_name: req.body.college_name,
      Address: req.body.Address
    };
  
    var query = connection.query(
      "UPDATE college SET ? WHERE ?",
      [post1, { college_id: college_id }],
      function(error, results, fields) {
        if (error) throw error;
        res.send("Submited");
      }
    );
  });
  app.get("/colleges/:college_id", function(req, res) {
    console.log(req.params.course_id);
    var query = connection.query(
      "SELECT * FROM college WHERE college_id=?",
      [req.params.college_id],
      function(error, results, feilds) {
        if (error) throw error;
        let college = {};
        if(results.length > 0) {
          // console.log(results,results.length);
          college = results[0];
        }
        res.json({ college: college });
      }
    );
  });
  
  app.delete("/colleges/:college_id", function(req, res) {
    console.log(req.params.college_id);
    var query = connection.query(
      "DELETE FROM college WHERE college_id=?",
      [req.params.college_id],
      function(error, results, feilds) {
        if (error) throw error;
        res.json({ success: "Submitted" });
      }
    );
  });
function getcolleges(callback) {
    var query = connection.query("SELECT * FROM college", function(error, data) {
      if (error) throw error;
      callback(data);
    });
  }

app.listen(3000, function(err) {
    if(err) throw error;
    console.log("Listening on port 3000");
    console.log("Listening on port 3000");
  });
  app.get("/courses", function(req, res) {
    getcourses(function(results) {
      res.render("courses", { result_courses: results });
    });
  });
  
  app.get("/courses/:course_id", function(req, res) {
    console.log(req.params.course_id);
    var query = connection.query(
      "SELECT * FROM courses WHERE course_id=?",
      [req.params.course_id],
      function(error, results, feilds) {
        if (error) throw error;
        let course = {};
        if(results.length > 0) {
          course = results[0];
        }
        res.json({ course: course });
      }
    );
  });
  
  app.post("/courses", function(req, res) {
    console.log(req.body);
    var post2 = {
      course: req.body.course
    };
    var query = connection.query("INSERT INTO courses SET ?", post2, function(
      error,
      results,
      fields
    ) {
      if (error) throw error;
      res.send("Submitted");
    });
  });
  
  
  
  
  app.put("/courses", function(req, res) {
    console.log(req.body);
    var course_id = req.body.id;
    var post2 = {
      course: req.body.course,
    };
  
    var query = connection.query(
      "UPDATE courses SET ? WHERE ?",
      [post2, {id:course_id }],
      function(error, results, fields) {
        if (error) throw error;
        res.send("Submited");
      }
    );
  });
  
  
  
  
  app.delete("/courses/:course_id", function(req, res) {
    console.log(req.params.course_id);
    var query = connection.query(
      "DELETE FROM courses WHERE course_id=?",
      [req.params.course_id],
      function(error, results, feilds) {
        if (error) throw error;
        res.json({ success: "Submitted" });
      }
    );
  });
  function getcourses(callback) {
    var query = connection.query("SELECT * FROM courses", function(error, data1) {
      if (error) throw error;
      callback(data1);
    });
  }
  var storage = multer.diskStorage({
    destination: function(req, file, callback) {
      callback(null, "./upload");
    },
    filename: function(req, file, callback) {
      let str = randomstring.generate({
        length: 12,
        charset: "alphabetic"
      });
      var filename = str + Date.now() + path.extname(file.originalname);
      callback(null, filename);
    }
  });
  var upload = multer({ storage: storage }).single("filename");
  app.get("/", function(req, res) {
    res.sendFile(__dirname + "students");
  });
  app.post("/students", function(req, res) {
    upload(req, res, function(err) {
      if (err) {
        return res.end("Error uploading file.");
      }
      const post = {
        filename: req.file.filename,
        originalfile:req.file.originalname,
        student_name: req.body.student_name,
        email_id: req.body.email_id,
        college_id: req.body.college_id,
        course_id: req.body.course_id,
        mobile_no: req.body.mobile_no,
        
        
      };
      connection.query("INSERT INTO students SET ?", post, function(
        error,
        result,
        fields
      ) {
        if (error) throw error;
        res.redirect("/students");
      });
    
    });
  });
  
/*app.post("/students", function(req, res) {
  console.log(req.body);
  var post3 = {
    student_name: req.body.student_name,
    email_id: req.body.email_id,
    college_id: req.body.college_id,
    course_id: req.body.course_id,
    mobile_no: req.body.mobile_no
  };

  var query = connection.query("INSERT INTO students SET ?", post3, function(
    error,
    results,
    feilds
  ) {
    if (error) throw error;
    res.send("Submitted");
  });
});*/
  //student//
  app.get("/students", function(req, res) {
    getcolleges(function(colleges) {
      getcourses(function(courses) {
        getstudents(function(results) {
          res.render("students", {
            results_stud: results,
            colleges: colleges,
            courses: courses
          });
        });
      });
    });
  });
  function getstudents(callback) {
    var query = connection.query(
      "SELECT students.*,college.college_name,courses.course  FROM students LEFT JOIN college ON (students.college_id=college.college_id) LEFT JOIN courses ON (students.course_id=courses.course_id)ORDER BY student_name",
      function(error, data3) {
        if (error) throw error;
        callback(data3);
      }
    );
  };
  
  /*app.put("/students", function(req, res) {
    console.log(req.body);
    var student_id = req.body.student_id;
    var post3 = {
      student_name: req.body.student_name,
      email_id: req.body.email_id,
      college_id: req.body.college_id,
      course_id: req.body.course_id,
      mobile_no: req.body.mobile_no
    };
  
    var query = connection.query(
      "UPDATE students SET ? WHERE ?",
      [post3, {id:student_id }],
      function(error, results, fields) {
        if (error) throw error;
        res.send("Submitted");
      }
    );
  });
  */
  
  
  
  app.delete("/students/:student_id", function(req, res) {
    console.log(req.params.student_id);
    var query = connection.query(
      "DELETE FROM students WHERE student_id=?",
      [req.params.student_id],
      function(error, results, feilds) {
        if (error) throw error;
        res.json({ success: "Submitted" });
      }
    );
  }); 
  
  
  app.get("/students/:student_id", function(req, res) {
    console.log(req.params.student_id);
    var query = connection.query(
      "SELECT * FROM students WHERE student_id=?",
      [req.params.student_id],
      function(error, results, feilds) {
        if (error) throw error;
        let student = {};
        if(results.length > 0) {
                  student = results[0];
        }
        res.json({ student: student });
        console.log(student);
      }
    );
  });
  
  
  
  /*app.post("/students", function(req, res) {
    console.log(req.body);
    var post3 = {
      student_name: req.body.student_name,
      email_id: req.body.email_id,
      college_id: req.body.college_id,
      course_id: req.body.course_id,
      mobile_no: req.body.mobile_no
    };
  
    var query = connection.query("INSERT INTO students SET ?", post3, function(
      error,
      results,
      feilds
    ) {
      if (error) throw error;
      res.send("Submitted");
    });
  });*/
  
  
  
  /*app.put("/students", function(req, res) {
    console.log(req.body);
    var student_id = req.body.student_id;
    var post3 = {
      student_name: req.body.student_name,
      email_id: req.body.email_id,
      college_id: req.body.college_id,
      course_id: req.body.course_id,
      mobile_no: req.body.mobile_no
    };
  
    var query = connection.query(
      "UPDATE students SET ? WHERE ?",
      [post3, {id:student_id }],
      function(error, results, fields) {
        if (error) throw error;
        res.send("Submitted");
      }
    );
  });
  
  
  
  
  app.delete("/students/:student_id", function(req, res) {
    console.log(req.params.student_id);
    var query = connection.query(
      "DELETE FROM students WHERE id=?",
      [req.params.student_id],
      function(error, results, feilds) {
        if (error) throw error;
        res.json({ success: "Submitted" });
      }
    );
  }); 
  app.listen(3000, function() {
    console.log("created!!!");
  });
  
  function getstudents(callback) {
    var query = connection.query(
      "SELECT students.*,college.college_name,courses.course  FROM students LEFT JOIN Info1 ON (students.college_id=college.college_id) LEFT JOIN courses ON (students.course_id=courses.id)ORDER BY student_name",
      function(error, data3) {
        if (error) throw error;
        callback(data3);
      }
    );
  }
  
/*var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");

var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "fincrux@3",
  database: "arvind"
});

connection.connect();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: "jhfhfuf" }));

var path = require("path");
app.use(express.static("task"));
app.set("view engine", "ejs");

//college//

app.get("/", function(req, res) {
  res.redirect("/colleges");
});
app.get("/colleges", function(req, res) {
  getcolleges(function(results) {
    res.render("/colleges", { results_clg: results });
  });
});

app.post("/colleges", function(req, res) {
  console.log(req.body);
  var post1 = {
    college_name: req.body.college_name,
    Address: req.body.Address
  };
  var query = connection.query("INSERT INTO Info1 SET ?", post1, function(
    error,
    results,
    fields
  ) {
    if (error) throw error;
    res.send("Submited");
  });
});

app.put("/colleges", function(req, res) {
  console.log(req.body);
  var college_id = req.body.college_id;
  var post1 = {
    college_name: req.body.college_name,
    Address: req.body.Address
  };

  var query = connection.query(
    "UPDATE Info1 SET ? WHERE ?",
    [post1, { college_id: college_id }],
    function(error, results, fields) {
      if (error) throw error;
      res.send("Submited");
    }
  );
});
app.get("/colleges/:college_id", function(req, res) {
  console.log(req.params.course_id);
  var query = connection.query(
    "SELECT * FROM Info1 WHERE college_id=?",
    [req.params.college_id],
    function(error, results, feilds) {
      if (error) throw error;
      let college = {};
      if(results.length > 0) {
        // console.log(results,results.length);
        college = results[0];
      }
      res.json({ college: college });
    }
  );
});

app.delete("/colleges/:college_id", function(req, res) {
  console.log(req.params.college_id);
  var query = connection.query(
    "DELETE FROM Info1 WHERE college_id=?",
    [req.params.college_id],
    function(error, results, feilds) {
      if (error) throw error;
      res.json({ success: "Submitted" });
    }
  );
});

//course//
/*app.get("/courses", function(req, res) {
  getcourses(function(results) {
    res.render("pages/courses", { result_courses: results });
  });
});

app.get("/courses/:course_id", function(req, res) {
  console.log(req.params.course_id);
  var query = connection.query(
    "SELECT * FROM courses WHERE id=?",
    [req.params.course_id],
    function(error, results, feilds) {
      if (error) throw error;
      let course = {};
      if(results.length > 0) {
        course = results[0];
      }
      res.json({ course: course });
    }
  );
});

app.post("/courses", function(req, res) {
  console.log(req.body);
  var post2 = {
    course: req.body.course
  };
  var query = connection.query("INSERT INTO courses SET ?", post2, function(
    error,
    results,
    fields
  ) {
    if (error) throw error;
    res.send("Submitted");
  });
});




app.put("/courses", function(req, res) {
  console.log(req.body);
  var course_id = req.body.id;
  var post2 = {
    course: req.body.course,
  };

  var query = connection.query(
    "UPDATE courses SET ? WHERE ?",
    [post2, {id:course_id }],
    function(error, results, fields) {
      if (error) throw error;
      res.send("Submited");
    }
  );
});




app.delete("/courses/:course_id", function(req, res) {
  console.log(req.params.course_id);
  var query = connection.query(
    "DELETE FROM courses WHERE id=?",
    [req.params.course_id],
    function(error, results, feilds) {
      if (error) throw error;
      res.json({ success: "Submitted" });
    }
  );
});

//student//
app.get("/students", function(req, res) {
  getcolleges(function(colleges) {
    getcourses(function(courses) {
      getstudents(function(results) {
        res.render("pages/students", {
          results_stud: results,
          colleges: colleges,
          courses: courses
        });
      });
    });
  });
});



app.get("/students/:student_id", function(req, res) {
  console.log(req.params.student_id);
  var query = connection.query(
    "SELECT * FROM students WHERE id=?",
    [req.params.student_id],
    function(error, results, feilds) {
      if (error) throw error;
      let student = {};
      if(results.length > 0) {
                student = results[0];
      }
      res.json({ student: student });
      console.log(student);
    }
  );
});



app.post("/students", function(req, res) {
  console.log(req.body);
  var post3 = {
    student_name: req.body.student_name,
    email_id: req.body.email_id,
    college_id: req.body.college_id,
    course_id: req.body.course_id,
    mobile_no: req.body.mobile_no
  };

  var query = connection.query("INSERT INTO students SET ?", post3, function(
    error,
    results,
    feilds
  ) {
    if (error) throw error;
    res.send("Submitted");
  });
});



app.put("/students", function(req, res) {
  console.log(req.body);
  var student_id = req.body.student_id;
  var post3 = {
    student_name: req.body.student_name,
    email_id: req.body.email_id,
    college_id: req.body.college_id,
    course_id: req.body.course_id,
    mobile_no: req.body.mobile_no
  };

  var query = connection.query(
    "UPDATE students SET ? WHERE ?",
    [post3, {id:student_id }],
    function(error, results, fields) {
      if (error) throw error;
      res.send("Submitted");
    }
  );
});




app.delete("/students/:student_id", function(req, res) {
  console.log(req.params.student_id);
  var query = connection.query(
    "DELETE FROM students WHERE id=?",
    [req.params.student_id],
    function(error, results, feilds) {
      if (error) throw error;
      res.json({ success: "Submitted" });
    }
  );
}); */
/*app.listen(3000, function() {
  console.log("created!!!");
});

function getcolleges(callback) {
  var query = connection.query("SELECT * FROM Info1", function(error, data) {
    if (error) throw error;
    callback(data);
  });
}
/*function getcourses(callback) {
  var query = connection.query("SELECT * FROM courses", function(error, data1) {
    if (error) throw error;
    callback(data1);
  });
}
function getstudents(callback) {
  var query = connection.query(
    "SELECT students.*,Info1.college_name,courses.course  FROM students LEFT JOIN Info1 ON (students.college_id=Info1.college_id) LEFT JOIN courses ON (students.course_id=courses.id)ORDER BY student_name",
    function(error, data3) {
      if (error) throw error;
      callback(data3);
    }
  );
}
*/

