package csv.creators;

import java.util.List;

/**
 * default creator class which implements CreatorFromRow
 *
 * @param <T> generic type T
 */
public class DefaultCreator<T> implements CreatorFromRow<List<String>> {

  /**
   * overriden method which takes in a row and returns it as a list of strings without manipulating
   * it
   *
   * @param row of csv data
   * @return row of csv data, in inputted form as a List<String>
   */
  @Override
  public List<String> create(List<String> row) {
    return row;
  }
}
