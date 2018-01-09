using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using test.Models;
using System.Threading;
using System.Web;
using System.Net;
using System.IO;
namespace test.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {

            return View();
        }

        [Route("api/products")]
        public string products()
        {
            string token = "API_KEY";
            string start = "25.0574121,121.5964832";
            string end = "25.0534121,121.5964832";
            // Create a request for the URL. 		
            WebRequest request = WebRequest.Create("https://maps.googleapis.com/maps/api/directions/json?language=zh-TW&origin=" + start + "&destination=" + end + "&key=" + token);
            // If required by the server, set the credentials.
            request.Credentials = CredentialCache.DefaultCredentials;
            // Get the response.
            HttpWebResponse response = (HttpWebResponse)request.GetResponse();
            Stream dataStream = response.GetResponseStream();
            // Open the stream using a StreamReader for easy access.
            StreamReader reader = new StreamReader(dataStream);
            // Read the content.
            string responseFromServer = reader.ReadToEnd();

            // Cleanup the streams and the response.
            reader.Close();
            dataStream.Close();
            response.Close();

            return responseFromServer;
        }

    }
}
