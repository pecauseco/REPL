package src.csv.creators;

import java.util.ArrayList;
import java.util.List;

/** class to help handle factory failure exceptions */
public class FactoryFailureException extends Exception {

  final List<String> row;

  /**
   * constructor, takes in a message and row in which the failure occured
   *
   * @param message to inform user of error
   * @param row
   */
  public FactoryFailureException(String message, List<String> row) {
    super(message);
    this.row = new ArrayList<>(row);
  }
}
