
package test;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.squareup.moshi.Moshi;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import okio.Buffer;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import src.server.handlers.LoadCSVHandler;
import src.server.handlers.SearchCSVHandler;
import src.server.handlers.ViewCSVHandler;
import spark.Spark;

public class TestServer {


    @BeforeAll
    public static void setup_before_everything() {

        // Set the Spark port number. This can only be done once, and has to
        // happen before any route maps are added. Hence using @BeforeClass.
        // Setting port 0 will cause Spark to use an arbitrary available port.
        Spark.port(0);
        // Don't try to remember it. Spark won't actually give Spark.port() back
        // until route mapping has started. Just get the port number later. We're using
        // a random _free_ port to remove the chances that something is already using a
        // specific port on the system used for testing.

        // Remove the logging spam during tests
        //   This is surprisingly difficult. (Notes to self omitted to avoid complicating things.)

        // SLF4J doesn't let us change the logging level directly (which makes sense,
        //   given that different logging frameworks have different level labels etc.)
        // Changing the JDK *ROOT* logger's level (not global) will block messages
        //   (assuming using JDK, not Log4J)
        Logger.getLogger("").setLevel(Level.WARNING); // empty name = root logger
    }

    @BeforeEach
    public void setup() {
        // Re-initialize state, etc. for _every_ test method run
        // In fact, restart the entire Spark server for every test!
        LoadCSVHandler loadHandler = new LoadCSVHandler();
        Spark.get("/loadcsv", loadHandler);
        Spark.get("/viewcsv", new ViewCSVHandler(loadHandler));
        Spark.get("/searchcsv", new SearchCSVHandler(loadHandler));
        Spark.init();
        Spark.awaitInitialization(); // don't continue until the server is listening
    }

    @AfterEach
    public void teardown() {
        // Gracefully stop Spark listening on both endpoints
        Spark.unmap("/order");
        Spark.unmap("/loadcsv");
        Spark.unmap("/viewcsv");
        Spark.unmap("/searchcsv");
        Spark.awaitStop(); // don't proceed until the server is stopped
    }

    /**
     * Helper to start a connection to a specific API endpoint/params
     *
     * @param apiCall the call string, including endpoint (NOTE: this would be better if it had more
     *     structure!)
     * @return the connection for the given URL, just after connecting
     * @throws IOException if the connection fails for some reason
     */
    private static HttpURLConnection tryRequest(String apiCall) throws IOException {
        // Configure the connection (but don't actually send the request yet)
        URL requestURL = new URL("http://localhost:" + Spark.port() + "/" + apiCall);
        HttpURLConnection clientConnection = (HttpURLConnection) requestURL.openConnection();

        // The default method is "GET", which is what we're using here.
        // If we were using "POST", we'd need to say so.
        // clientConnection.setRequestMethod("GET");

        clientConnection.connect();
        return clientConnection;
    }

    private static Map<String, Object> getResponse(HttpURLConnection clientConnection)
            throws IOException {
        Moshi moshi = new Moshi.Builder().build();
        Map<String, Object> map =
                moshi.adapter(Map.class).fromJson(new Buffer().readFrom(clientConnection.getInputStream()));
        return map;
    }

    /**
     * tests a standard load file
     *
     * @throws IOException
     */
    @Test
    // Recall that the "throws IOException" doesn't signify anything but acknowledgement to the type
    // checker
    public void testAPILoadFile() throws IOException {
        HttpURLConnection clientConnection =
                tryRequest("loadcsv?filepath=ten-star&hasheaders=false");
        // Get an OK response (the *connection* worked, the *API* provides an error response)
        assertEquals(200, clientConnection.getResponseCode());

        Map<String, Object> expected = new HashMap<String, Object>();
        expected.put("result", "success");
        expected.put("filepath", "ten-star");
        Map<String, Object> actual = getResponse(clientConnection);

        assertEquals(expected, actual);

        // ^ If that succeeds, we got the expected response. Notice that this is *NOT* an exception, but
        // a real Json reply.

        clientConnection.disconnect();
    }

    /**
     * tests a loadfile on a file that doesnt exist
     *
     * @throws IOException
     */
    @Test
    public void testAPILoadNonExistantFile() throws IOException {
        HttpURLConnection clientConnection =
                tryRequest("loadcsv?filepath=ten-staryefyy&hasheaders=false");
        // Get an OK response (the *connection* worked, the *API* provides an error response)
        assertEquals(200, clientConnection.getResponseCode());

        Map<String, Object> expected = new HashMap<String, Object>();
        expected.put("result", "error_file_not_found");
        Map<String, Object> actual = getResponse(clientConnection);

        assertEquals(expected, actual);

        // ^ If that succeeds, we got the expected response. Notice that this is *NOT* an exception, but
        // a real Json reply.

        clientConnection.disconnect();
    }

    /**
     * tests two file loads, makes sure that the second overrides the first
     *
     * @throws IOException
     */
    @Test
    public void test2Loads() throws IOException {
        HttpURLConnection clientConnection = tryRequest("loadcsv?filepath=ten-stars&hasheaders=false");
        HttpURLConnection clientConnection2 =
                tryRequest("loadcsv?filepath=two-star&hasheaders=false");
        // Get an OK response (the *connection* worked, the *API* provides an error response)
        assertEquals(200, clientConnection2.getResponseCode());

        Map<String, Object> expected = new HashMap<String, Object>();
        expected.put("result", "success");
        expected.put("filepath", "two-star");
        Map<String, Object> actual = getResponse(clientConnection2);

        assertEquals(expected, actual);

        // ^ If that succeeds, we got the expected response. Notice that this is *NOT* an exception, but
        // a real Json reply.

        clientConnection.disconnect();
    }

    /**
     * tests a loadfile on a file when no path is provided
     *
     * @throws IOException
     */
    @Test
    public void testAPILoadNoPath() throws IOException {
        HttpURLConnection clientConnection = tryRequest("loadcsv");
        // Get an OK response (the *connection* worked, the *API* provides an error response)
        assertEquals(200, clientConnection.getResponseCode());

        Map<String, Object> expected = new HashMap<String, Object>();
        expected.put("result", "no_filepath_provided");

        Map<String, Object> actual = getResponse(clientConnection);

        assertEquals(expected, actual);

        // ^ If that succeeds, we got the expected response. Notice that this is *NOT* an exception, but
        // a real Json reply.

        clientConnection.disconnect();
    }

    /**
     * tests view when no file was loaded
     *
     * @throws IOException
     */
    @Test
    public void testViewNoLoadedFile() throws IOException {
        HttpURLConnection clientConnection = tryRequest("viewcsv");

        Map<String, Object> expected = new HashMap<String, Object>();
        expected.put("result", "no_file_loaded");

        Map<String, Object> actual = getResponse(clientConnection);

        assertEquals(expected, actual);

        // ^ If that succeeds, we got the expected response. Notice that this is *NOT* an exception, but
        // a real Json reply.

        clientConnection.disconnect();
    }

    /**
     * tests view when valid file was loaded
     *
     * @throws IOException
     */
    @Test
    public void testViewSimple() throws IOException {
        HttpURLConnection clientConnection =
                tryRequest("loadcsv?filepath=most-simple&hasheaders=false");
        // Get an OK response (the *connection* worked, the *API* provides an error response)
        assertEquals(200, clientConnection.getResponseCode());

        Map<String, Object> expected = new HashMap<String, Object>();
        expected.put("result", "success");
        expected.put("filepath", "most-simple");
        Map<String, Object> actual = getResponse(clientConnection);

        assertEquals(expected, actual);

        clientConnection = tryRequest("viewcsv");
        Map<String, Object> expected2 = new HashMap<String, Object>();
        expected2.put("result", "success");
        ArrayList<ArrayList<String>> viewData = new ArrayList<ArrayList<String>>();
        ArrayList<String> innerArr1 =
                new ArrayList<String>() {
                    {
                        add("0");
                        add("1");
                    }
                };
        ArrayList<String> innerArr2 =
                new ArrayList<String>() {
                    {
                        add("2");
                        add("3");
                    }
                };

        viewData.add(innerArr1);
        viewData.add(innerArr2);

        expected2.put("data", viewData);

        Map<String, Object> actual2 = getResponse(clientConnection);

        assertEquals(expected2, actual2);

        // ^ If that succeeds, we got the expected response. Notice that this is *NOT* an exception, but
        // a real Json reply.

        clientConnection.disconnect();
    }

    /**
     * tests when search value doesnt exist
     *
     * @throws IOException
     */
    @Test
    public void testSearchDoesntExist() throws IOException {
        HttpURLConnection clientConnection =
                tryRequest("loadcsv?filepath=most-simple&hasheaders=false");
        Map<String, Object> actual = getResponse(clientConnection);

        clientConnection = tryRequest("searchcsv?value=213232");
        Map<String, Object> expected2 = new HashMap<String, Object>();
        expected2.put("result", "value_not_found");


        Map<String, Object> actual2 = getResponse(clientConnection);

        assertEquals(expected2, actual2);

        // ^ If that succeeds, we got the expected response. Notice that this is *NOT* an exception, but
        // a real Json reply.

        clientConnection.disconnect();
    }
    /**
     * tests simple search
     *
     * @throws IOException
     */
    @Test
    public void testSearchSimple() throws IOException {
        HttpURLConnection clientConnection =
                tryRequest("loadcsv?filepath=most-simple&hasheaders=false");
        Map<String, Object> actual = getResponse(clientConnection);

        clientConnection = tryRequest("searchcsv?value=0");
        Map<String, Object> expected2 = new HashMap<String, Object>();
        expected2.put("result", "success");
        ArrayList<ArrayList<String>> viewData = new ArrayList<ArrayList<String>>();
        ArrayList<String> innerArr1 =
                new ArrayList<String>() {
                    {
                        add("0");
                        add("1");
                    }
                };

        viewData.add(innerArr1);

        expected2.put("search_result", viewData);

        Map<String, Object> actual2 = getResponse(clientConnection);

        assertEquals(expected2, actual2);

        // ^ If that succeeds, we got the expected response. Notice that this is *NOT* an exception, but
        // a real Json reply.

        clientConnection.disconnect();
    }


}
