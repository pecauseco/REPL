package src.csv;

import java.util.ArrayList;
import java.util.List;

/**
 * the Search class allows users to provide a csv filepath and a term to search for within it, and
 * ths class will perform the search. there is also an option for users to input a column index to
 * limit their search to
 */
public class Search {

  private String searchValue;
  private int colIndex;
  private List<List<String>> csvData;
  private List<List<String>> searchResults;

  /**
   * first constructor for Search, this one should be used when the user does not want to specify a
   * column to search within
   *
   * @param searchValue value to be searched for within the data
   */
  public Search(String searchValue, List<List<String>> csv) {
    this.searchValue = searchValue;
    this.csvData = csv;
    this.searchResults = new ArrayList<>();
    this.performSearch(false);
  }

  /**
   * second constructor for Search, this one should be used when the user wants to specify a column
   * index to search within
   *
   * @param searchValue value to be searched for within the data
   * @param colIndex index of column to be searched within
   */
  public Search(String searchValue, int colIndex, List<List<String>> csv) {
    this.searchValue = searchValue;
    this.colIndex = colIndex;
    this.csvData = csv;
    this.searchResults = new ArrayList<>();
    this.performSearch(true); // using col index
  }

  /**
   * third constructor for Search, this one should be used when the user wants to specify a column
   * name to search within
   *
   * @param searchValue value to be searched for within the data
   * @param colName name of column to be searched within
   */
  public Search(String searchValue, String colName, List<List<String>> csv) {
    this.searchValue = searchValue;
    this.csvData = csv;
    this.searchResults = new ArrayList<>();
    this.searchOnColName(colName); // using col index
  }

  /**
   * this method performs a search on the given csv through reading in the file, parsing the data,
   * and searching using helper methods depending on if the user inputted a column index to search
   * on or not
   *
   * @param onColumn
   */
  public void performSearch(boolean onColumn) {
    System.out.println(this.csvData);
    if (onColumn == false) {
      this.genericSearch(this.csvData);
    } else {
      this.searchOnCol(this.csvData);
    }
    System.out.println(this.searchResults);
  }

  /**
   * this is a helper method that searches within all of the given data and adds any rows that
   * contain the search term to a List of searchResults, as well as printing the line in the
   * terminal
   *
   * @param toSearch the List<List<String>> that is being searched within
   */
  private void genericSearch(List<List<String>> toSearch) {
    for (List<String> l : toSearch) {
      for (String s : l) {
        if (s.equals(this.searchValue)) {
          this.searchResults.add(l);
          break;
        }
      }
    }
  }

  /**
   * this is a helper method that searches within the given column and adds any rows that contain
   * the search term in the given column to a List of searchResults, as well as printing it in the
   * terminal
   *
   * @param toSearch the List<List<String>> that is being searched within
   */
  public void searchOnCol(List<List<String>> toSearch) {
    for (List<String> l : toSearch) {
      if (l.get(this.colIndex).equals(this.searchValue)) { // only searches the given col index
        this.searchResults.add(l);
        break;
      }
    }
  }

  public void searchOnColName(String colName) {
    int colIndex = -1;
    for (int i = 0; i < this.csvData.size(); i++) {
      if (this.csvData.get(0).get(i).equals(colName)) {
        colIndex = i; // this is the correct column to search in
      }
    }

    if(colIndex == -1) { //should make this work better
      return;
    }

    for (List<String> l : this.csvData) {
      if (l.get(colIndex).equals(this.searchValue)) { // only searches the given col index
        this.searchResults.add(l);
        break;
      }
    }
  }

  /**
   * helper method that returns search results for testing purposes
   *
   * @return the list of rows that contain the search term
   */
  public List<List<String>> getSearchResults() {
    return this.searchResults;
  }
}
