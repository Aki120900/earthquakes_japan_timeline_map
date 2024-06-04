import pandas as pd

# Load the earthquake data
earthquakes_df = pd.read_csv('earthquakes_2.csv')

# Inspect the first few rows to understand its structure
print("Original Data:")
print(earthquakes_df.head())

# Ensure the necessary columns are present
necessary_columns = ['Year', 'Country', 'Location Name', 'Mag', 'Longitude', 'Latitude']
missing_columns = [col for col in necessary_columns if col not in earthquakes_df.columns]
if missing_columns:
    raise ValueError(f"Missing necessary columns: {missing_columns}")

# Remove rows with missing values in necessary columns
cleaned_earthquakes_df = earthquakes_df.dropna(subset=necessary_columns)

# Convert columns to appropriate data types
cleaned_earthquakes_df['Year'] = cleaned_earthquakes_df['Year'].astype(int)
cleaned_earthquakes_df['Mag'] = cleaned_earthquakes_df['Mag'].astype(float)
cleaned_earthquakes_df['Longitude'] = cleaned_earthquakes_df['Longitude'].astype(float)
cleaned_earthquakes_df['Latitude'] = cleaned_earthquakes_df['Latitude'].astype(float)

# Display the cleaned data
print("Cleaned Data:")
print(cleaned_earthquakes_df.head())

# Save the cleaned data to a new CSV file
cleaned_earthquakes_df.to_csv('earthquakes_cleaned.csv', index=False)


