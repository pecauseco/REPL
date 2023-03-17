package src.server.handlers;

import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import spark.Request;
import spark.Response;
import spark.Route;

/**
 * handler class for the loadcsv API endpoint
 */
public class ViewCSVHandler implements Route {

  private List<List<String>> list;
  private LoadCSVHandler loadHandler;

  /**
   * constructor that accepts a loadhandler of the previously loaded file
   * @param loadHandler gives information about the file that the user has loaded
   */
  public ViewCSVHandler(LoadCSVHandler loadHandler) {
    this.loadHandler = loadHandler;
  }

  /**
   * handles the view request and returns the response to the request
   * @param request the request to handle
   * @param response use to modify properties of the response
   * @return response content
   */
  @Override
  public Object handle(Request request, Response response) {
    this.list = this.loadHandler
            .getList();
    if (this.list != null) {
      return viewSuccessResponse(this.list);
    } else {
      return viewFailureResponse("no_file_loaded");
    }
  }

  /**
   * builds and serializes the response to a successful view
   * @param data the data to view
   * @return the response object
   */
  public String viewSuccessResponse(List<List<String>> data) {
    Map<String, Object> response = new HashMap<>();
    response.put("result", "success");
    response.put("data", data);

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
   * builds and serializes the response to a failed view
   * @param error_message the error message to provide the user
   * @return the response object
   */
  public String viewFailureResponse(String error_message) {
    Map<String, Object> response = new HashMap<>();
    response.put("result", error_message);
    Moshi moshi = new Moshi.Builder().build();
    JsonAdapter<Map> adapter = moshi.adapter(Map.class);
    return adapter.toJson(response);
  }
}
