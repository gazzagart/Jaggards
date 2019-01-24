importScripts('../node_modules/papaparse/papaparse.js');

    self.addEventListener(
        "message",
        function(e) {
            Papa.parse(e.data, {
                //worker: true, worker does not seem to be working. Might be an electron issue
                complete: function(results) {
                    self.postMessage(results.data);
                }
            });
    //   self.postMessage(e.data);
    },
    false
    );