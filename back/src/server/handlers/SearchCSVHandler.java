package src.server.handlers;

import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import src.csv.Search;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import spark.Request;
import spark.Response;
import spark.Route;

/** handler class for the searchcsv api */
public class SearchCSVHandler implements Route {

  private List<List<String>> list;
  private LoadCSVHandler loadHandler;

  /**
   * constructor for the class, takes in a loadhandler so that the program knows what file it is
   * searching on
   *
   * @param loadHandler the loadhandler for the loaded file
   */
  public SearchCSVHandler(LoadCSVHandler loadHandler) {
    this.loadHandler = loadHandler;
  }

  /**
   * handles the search request and returns the response to the request
   *
   * @param request the request to handle
   * @param response used to modify properties of the response
   * @return response content
   */
  @Override
  public Object handle(Request request, Response response) {
    String value = request.queryParams("value");
    String colIndex = request.queryParams("colindex");
    this.list = this.loadHandler.getList();
    Search s = null;

    if (value != null && this.list != null) {

      if (colIndex != null) {
        try{
          int col = Integer.parseInt(colIndex);
          s = new Search(value, col, this.list);
        }catch(NumberFormatException e){
          s = new Search(value, colIndex, this.list);
        }

      } else {
        s = new Search(value, this.list);
      }
      return searchSuccessResponse(s.getSearchResults());

    } else if (value == null) {
      return searchFailureResponse("error_please_specify_search_value");
    } else if (this.list == null) {
      return searchFailureResponse("error_no_file_loaded");
    } else {
      return searchFailureResponse("error_search_failure");
    }
  }

  /**
   * builds and serializes the response to a successful search
   *
   * @param data the data to search
   * @return the response object
   */
  public String searchSuccessResponse(List<List<String>> data) {
    Map<String, Object> response = new HashMap<>();
    response.put("result", "success");
    response.put("search_result", data);

    try {
      Moshi moshi = new Moshi.Builder().build();
      JsonAdapter<Map> adapter = moshi.adapter(Map.class);
      return adapter.toJson(response);
    } catch (Exception e) {
      e.printStackTrace();
      throw e;
    }
  }

  /**
   * builds and serializes the response to a failed search
   *
   * @param error_message the error message to provide the user
   * @return the response object
   */
  public String searchFailureResponse(String error_message) {
    Map<String, Object> response = new HashMap<>();
    response.put("result", error_message);
    Moshi moshi = new Moshi.Builder().build();
    JsonAdapter<Map> adapter = moshi.adapter(Map.class);
    return adapter.toJson(response);
  }
}
