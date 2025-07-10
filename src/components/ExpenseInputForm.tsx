
import React from 'react';
import { Plus, Minus, Calculator, Save, Users, IndianRupee, FileText } from 'lucide-react';
import { Person, ExpenseRecord } from '../utils/expenseCalculations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ExpenseInputFormProps {
  people: Person[];
  expenseName: string;
  setExpenseName: (name: string) => void;
  updatePersonName: (personIndex: number, name: string) => void;
  updateExpense: (personIndex: number, expenseIndex: number, field: keyof ExpenseRecord, value: string | number) => void;
  addExpense: (personIndex: number) => void;
  removeExpense: (personIndex: number, expenseIndex: number) => void;
  addPerson: () => void;
  removePerson: (index: number) => void;
  onCalculate: () => void;
  onSave: () => void;
  isCalculating: boolean;
  isGuestMode?: boolean;
}

const ExpenseInputForm = ({
  people,
  expenseName,
  setExpenseName,
  updatePersonName,
  updateExpense,
  addExpense,
  removeExpense,
  addPerson,
  removePerson,
  onCalculate,
  onSave,
  isCalculating,
  isGuestMode = false
}: ExpenseInputFormProps) => {
  const totalExpense = people.reduce((sum, person) => 
    sum + person.expenses.reduce((expenseSum, expense) => expenseSum + expense.amountPaid, 0), 0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Split Your Expenses
        </h1>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
          Add expenses for each person and calculate how much everyone owes each other.
        </p>
      </div>

      {/* Expense Name Input */}
      <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-2">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <FileText className="w-5 h-5 mr-2 text-blue-600" />
            Expense Name
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            placeholder="Enter expense name (e.g., Dinner at Restaurant, Trip to Beach)"
            value={expenseName}
            onChange={(e) => setExpenseName(e.target.value)}
            className="text-base md:text-lg min-h-[44px]"
          />
        </CardContent>
      </Card>

      {/* People and Expenses */}
      <div className="grid gap-6">
        {people.map((person, personIndex) => (
          <Card key={personIndex} className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-violet-600" />
                  <span>Person {personIndex + 1}</span>
                </div>
                {people.length > 2 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removePerson(personIndex)}
                    className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 min-h-[40px] px-3"
                  >
                    <Minus className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Remove Person</span>
                    <span className="sm:hidden">Remove</span>
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name *
                </label>
                <Input
                  type="text"
                  placeholder="Enter person's name"
                  value={person.name}
                  onChange={(e) => updatePersonName(personIndex, e.target.value)}
                  className="text-base md:text-lg min-h-[44px]"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Expenses
                </label>
                {person.expenses.map((expense, expenseIndex) => (
                  <div key={expenseIndex} className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">
                    <div className="flex-1">
                      <Input
                        type="text"
                        placeholder="Description (optional)"
                        value={expense.description}
                        onChange={(e) => updateExpense(personIndex, expenseIndex, 'description', e.target.value)}
                        className="min-h-[44px]"
                      />
                    </div>
                    <div className="flex gap-2 items-end">
                      <div className="flex-1 sm:w-32">
                        <div className="relative">
                          <IndianRupee className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            type="number"
                            placeholder="Amount"
                            value={expense.amountPaid || ''}
                            onChange={(e) => updateExpense(personIndex, expenseIndex, 'amountPaid', parseFloat(e.target.value) || 0)}
                            className="pl-8 min-h-[44px]"
                            min="0"
                            step="0.01"
                          />
                        </div>
                      </div>
                      {person.expenses.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeExpense(personIndex, expenseIndex)}
                          className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 min-h-[44px] min-w-[44px] px-2"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addExpense(personIndex)}
                  className="text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 min-h-[40px]"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Expense
                </Button>
              </div>

              <div className="pt-2 border-t">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Total for {person.name || `Person ${personIndex + 1}`}: ₹
                  {person.expenses.reduce((sum, expense) => sum + expense.amountPaid, 0).toFixed(2)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Person Button */}
      <div className="text-center">
        <Button
          variant="outline"
          onClick={addPerson}
          className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-violet-400 dark:hover:border-violet-500 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all duration-300 min-h-[48px] px-6"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Another Person
        </Button>
      </div>

      {/* Summary Card */}
      <Card className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border-2 border-violet-200 dark:border-violet-800">
        <CardContent className="py-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="text-center sm:text-left">
              <p className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
                Total Expense: ₹{totalExpense.toFixed(2)}
              </p>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
                {people.length} people • ₹{(totalExpense / people.length).toFixed(2)} per person
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              {!isGuestMode && (
                <Button
                  variant="outline"
                  onClick={onSave}
                  className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm min-h-[48px] w-full sm:w-auto"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              )}
              <Button
                onClick={onCalculate}
                disabled={isCalculating}
                className="bg-gradient-to-r from-violet-500 via-purple-500 to-blue-500 hover:from-violet-600 hover:via-purple-600 hover:to-blue-600 text-white px-6 md:px-8 py-3 text-base md:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] transform min-h-[48px] w-full sm:w-auto"
              >
                {isCalculating ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Calculating...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Calculator className="w-5 h-5 mr-2" />
                    Calculate Split
                  </div>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {isGuestMode && (
        <Card className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800">
          <CardContent className="py-4">
            <p className="text-amber-800 dark:text-amber-200 text-sm text-center">
              <strong>Guest Mode:</strong> You can calculate expense splits but won't be able to save to history. 
              Sign in to save and access your expense history.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ExpenseInputForm;
