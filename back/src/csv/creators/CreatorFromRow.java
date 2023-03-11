package edu.brown.cs.student.main.csv.creators;

import java.util.List;

/**
 * interface that can be implemented by the developer. this allow for factory pattern, generic usage
 * of the create() method
 *
 * @param <T> generic type T
 */
public interface CreatorFromRow<T> {

  /**
   * this method allows the developer to return any T given a row that is being parsed
   *
   * @param row a row in the csv, which is a List<Strings>
   * @return any generic T
   * @throws FactoryFailureException this exception is caught in Parse
   */
  T create(List<String> row) throws FactoryFailureException;
}
