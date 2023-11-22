$(document).ready(function () {
    // $("#auth").click();
    $("#register_CodeCrafter").click(function () {
        let legendCodeCrafter = $("#codecrafterName").val();
        $(".legendCodeCrafter").text(legendCodeCrafter);
    });
    // Parse the syllabus
    $.getJSON("./src/json/syllabus.json",
        function (data) {

            var syll_dat = "";

            // Loop through modules
            $.each(data.modules, function (index, module) {
                // Use .map() to generate HTML for the tags
                var tagsHTML = module.tags.map(function (tag) {
                    return `
                <button class="badge text-bg-success mx-2 topicLink" type="button" data-bs-toggle="offcanvas" data-bs-target="#information_topic" aria-controls="information_topic" topic="${tag}">
                    ${tag}
                </button>`;
                });

                syll_dat += `
                <div class="container-fluid topicCard border-bottom pb-3">
                    <h1>${module.moduleNumber} :</h1>
                    <p class="basic text-info">
                        ${module.topic}
                    </p>
                    <div class="tags container-fluid d-flex basic ">
                        <div class="col-2">
                            <h5 class="text-success" style="line-height: 15px;">Tags : </h5>
                        </div>
                        <div class="col-10">
                            ${tagsHTML.join('')}
                        </div>
                    </div>
                </div>
            `;
            });

            $("#syllabus_content").html(syll_dat);

            function loadData(elem) {
                let topc = $(elem).attr("topic");
                $("#information_topicLabel").text(topc);
                $("#info_title").text(topc);
                $.getJSON("./src/json/topic_description.json",
                    function (data) {
                        var tf = null;
                        for (const topic of data.resource) {
                            if (topic.tag === topc) {
                                tf = topic;
                                break;
                            }
                        }

                        // Iterating The requirements
                        $("#desc_topic").html(tf.large_desc);
                        $("#topicFact").html(tf.tag);
                        let srch = "https://www.google.com/search?q=" + tf.tag.toLowerCase().replace(/ /g, "%20");
                        let ytsrch = "https://www.youtube.com/results?search_query=" + tf.tag.toLowerCase().replace(/ /g, "%20");
                        $("#searchGgl").attr("href", srch);
                        $("#searchYt").attr('href', ytsrch);
                        $("#desc-sm").html(tf.small_desc)
                        var facts = "";
                        for (const fact of tf.facts) {
                            facts += `<li>${fact}</li>`;
                        }
                        $("#facts").html(facts);
                        var reltpc = "";
                        for (const retp of tf.related) {
                            reltpc += `
                            <li>
                                <a topic="${retp}" class="reltopic d-flex flex-column flex-lg-row gap-3 align-items-start align-items-lg-center py-3 link-body-emphasis text-decoration-none border-top">
                                    <div class="col-lg-8">
                                        <h6 class="mb-0">${retp}</h6>
                                    </div>
                                </a>
                            </li>
                            `;
                        }
                        $("#related_topics").html(reltpc);
                        $(".reltopic").on("click", function () {
                            loadData($(this));
                        });

                    }
                );
            }

            // // Integrating Topic Button
            $(".topicLink").on("click", function () {
                loadData($(this));
            });



        });
    // auth
    $("#codecrafterName, #codecrafterPasswd").on("input", function () {
        let legend_name = $("#codecrafterName").val();
        let legend_passwd = $("#codecrafterPasswd").val();
        legend_name = legend_name.toLowerCase();
        $.getJSON("./src/json/cred.json", function (data) {
            let validUserFound = false;
            for (let i = 0; i < data.valid_users.length; i++) {
                const element = data.valid_users[i].user;
                if (element === legend_name) {
                    if (legend_passwd == data.valid_users[i].password) {
                        validUserFound = true;
                    }
                    break;
                }
            }
            if (validUserFound) {
                $("#register_CodeCrafter").removeClass("disabled");
                $("#register_CodeCrafter").removeClass("btn-danger");
                $("#register_CodeCrafter").addClass("btn-success");
            } else {
                $("#register_CodeCrafter").addClass("disabled");
                $("#register_CodeCrafter").addClass("btn-danger");
                $("#register_CodeCrafter").removeClass("btn-success");
            }
        });
    })

});
