package src.csv;

import src.csv.creators.CreatorFromRow;
import src.csv.creators.FactoryFailureException;
import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.Reader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * this is the parser class. when instantiated, the parse() method can be called to return a list of
 * generic type T, which can be though of as a list of each row in the csv. each row will be
 * returned in the form of a different Object depending on which creator is written/passed in by the
 * developer.
 *
 * @param <T> generic type T
 */
public class Parser<T> {

  private Reader reader;
  private CreatorFromRow<T> creator;

  /**
   * constructor for the Parser class
   *
   * @param reader any Reader that the user prefers, ex. BufferedReader or FileReader
   * @param creator an instance of any class that implements CreatorFromRow<T>
   */
  public Parser(Reader reader, CreatorFromRow<T> creator) {
    this.reader = reader;
    this.creator = creator;
  }

  /**
   * method that parses the given data using a BufferedReader and returns the parsed data
   *
   * @return List<T>, which could be List<List<String>>, List<*insert any class*>, allows user
   *     flexibility in what structure want their data to be parsed into
   */
  public List<T> parse() {
    List<T> returnList = new ArrayList<>();
    BufferedReader buffReader = null;
    try { //
      buffReader = new BufferedReader(this.reader);
      String row = buffReader.readLine();
      while (row != null) {
        List<String> tokens = Arrays.asList(row.split(","));
        returnList.add(this.creator.create(tokens));
        //        buffReader.mark(0); // to mark line so that if error must be handled, we know
        // where we left off
        row = buffReader.readLine();
      }
      // if the file cannot be found, message is printed and exits gracefully
    } catch (FileNotFoundException f) {
      System.err.println("File cannot be found or opened: ");
      System.exit(0);
    } catch (IOException i) {
      System.err.println(i.getMessage());
      System.exit(0);
    } catch (FactoryFailureException e) {
      // if row couldnt be parsed, move on to next row and print a message to the user
      System.err.println(e.getMessage());
      //      buffReader.reset(); // resets the reader to the line
      //      this.parse();

    }
    return new ArrayList<T>(returnList);
  }
}
