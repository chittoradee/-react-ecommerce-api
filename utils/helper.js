const mv = require('mv');
const fs = require("fs")
class helper{
    getImageUploadFolder(){
        let current_datetime = new Date()
        const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN","JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        let formatted_date = monthNames[current_datetime.getMonth()]+current_datetime.getFullYear();
        return formatted_date;
    }
    getTimestamp(){
        return new Date().getTime();
    }
    
    uploadFile(filepath,file){
        const tempPath = file.image.path;
        const folderPath = this.getImageUploadFolder();
        const timestamp =  this.getTimestamp();
        fs.mkdir(filepath+folderPath, { recursive: true }, function(err) {
            if (err) {
                // console.log(err)
            } else {
                //console.log("New directory successfully created.")
            }
        });
        const filename = folderPath+'/'+timestamp+"_"+file.image.name
        const targetPath = filepath+filename;
        mv(tempPath, targetPath, function (err) {
            if (err) throw err;
        });
        return filename;
    }

    async unlinkFile(filepath,file){      
        fs.unlink(filepath+file, (err) => {
            if (err) {
                return
            }
        })
    }
}   
module.exports = helper;