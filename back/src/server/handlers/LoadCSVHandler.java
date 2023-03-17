package server.handlers;

import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import csv.Parser;
import csv.creators.CreatorFromRow;
import csv.creators.DefaultCreator;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import spark.Request;
import spark.Response;
import spark.Route;

/**
 * handler class for the loadCSV API endpoint
 */
public class LoadCSVHandler implements Route {

  private List<List<String>> list;
  private boolean hasHeaders;

  public LoadCSVHandler() {}

  /**
   * handles the load request and returns the response to the request
   * @param request the request to handle
   * @param response use to modify properties of the response
   * @return response content
   */
  @Override
  public Object handle(Request request, Response response) {
    String filepath = request.queryParams("filepath");

    //make sure all parameters were given before proceeding
    if(filepath == null) {
      return this.loadFailureResponse("no_filepath_provided");
    }
    if(request.queryParams("hasheaders") == null) {
      return this.loadFailureResponse("error_please_provide_hasheaders_value");
    }

    try {
      this.hasHeaders = Boolean.parseBoolean(request.queryParams("hasHeaders"));
      CreatorFromRow<List<String>> rowCreator = new DefaultCreator<>();
      Parser parser = new Parser<>(new FileReader("data/" + filepath + ".csv"), rowCreator);
      this.list = parser.parse();
      return this.loadSuccessResponse(filepath);
    } catch (FileNotFoundException e) {
      return this.loadFailureResponse("error_file_not_found");
    }
  }

  /**
   * builds and serializes the response to a successfully loaded file
   * @param loadedFile the filepath that was loaded
   * @return the response object
   */
  public String loadSuccessResponse(String loadedFile) {
    Map<String, Object> response = new HashMap<>();
    response.put("result", "success");
    response.put("filepath", loadedFile);

    try {
      Moshi moshi = new Moshi.Builder().build();
      JsonAdapter<Map> adapter = moshi.adapter(Map.class); // what does this ean
      return adapter.toJson(response);
    } catch (Exception e) {
      e.printStackTrace();
      throw e;
    }
  }

  /**
   * builds and serializes the response to a failed loaded file
   * @param error_message the error message to provide the user
   * @return the response object
   */
  public String loadFailureResponse(String error_message) {
    Map<String, Object> response = new HashMap<>();
    response.put("result", error_message);
    Moshi moshi = new Moshi.Builder().build();
    JsonAdapter<Map> adapter = moshi.adapter(Map.class);
    return adapter.toJson(response);
  }

  /**
   * getter method for the csv data
   * @return the List<List<String>> that represents the csv
   */
  public List<List<String>> getList() {
    return this.list;
  }

  public boolean getHasHeaders() {
    return this.hasHeaders;
  }
}
