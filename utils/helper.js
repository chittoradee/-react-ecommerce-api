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
       // const tempPath = file.buffer;
        /* var magic = file.buffer.toString('hex', 0, 4)
        console.log(magic) */
        const folderPath = this.getImageUploadFolder();
        const timestamp =  this.getTimestamp();
        fs.mkdir(filepath+folderPath, { recursive: true }, function(err) {
            if (err) {
                // console.log(err)
            } else {
                //console.log("New directory successfully created.")
            }
        });
        const filename = folderPath+'/'+timestamp+"_"+file.originalname;
        fs.writeFile(filepath+filename, file.buffer, 'binary', function(err) {
            if (err) throw err
        })
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