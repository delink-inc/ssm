<template>
  <div class="app-container">
    <!-- upload excel files here -->
    <upload-excel-component @on-selected-file='selected'></upload-excel-component>
    <br>
    <!-- display form -->
    <el-form ref="resultsForm" :model="resultsForm" :rules="resultsRules" status-icon>
      <el-col :span="4">
        <el-form-item label="Term" prop="term">
          <el-select v-model="resultsForm.term" placeholder="Select exams term" size="medium">
            <el-option v-for="term in 3" :key="term" :value="term">Term {{term}}</el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="1">&nbsp;</el-col>
      <el-col :span="4">
        <el-form-item label="Exam" prop="type">
          <el-select v-model="resultsForm.type" placeholder="Select exams type" size="medium">
            <el-option v-for="type in examType" :key="type" :value="type">{{type}}</el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="1">&nbsp;</el-col>
      <el-col :span="4">
        <el-form-item label="Year" prop="year">
          <el-select v-model="resultsForm.year" placeholder="Please select year" size="medium">
            <el-option v-for="year in years" :key="year" :value="year">{{year}}</el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="1">&nbsp;</el-col>
      <el-col :span="4">
        <el-form-item label="Class" prop="cls">
          <el-select v-model="resultsForm.cls" placeholder="Select Class" size="medium">
            <el-option v-for="cls in classes" :key="cls.code" :label="cls.name" :value="cls.id"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="1">&nbsp;</el-col>
      <el-col :span="4">
        <el-form-item label="Class Teacher" prop="teacher">
          <el-select v-model="resultsForm.teacher" placeholder="Pick class Teacher" size="medium">
            <el-option v-for="teacher in teachers" :key="teacher.id" :label="teacher.first_name + ' ' + teacher.teacher_surname" :value="teacher.id"></el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <!-- button to upload results -->
      <el-button @click="getData(tableData, 'resultsForm')" type="primary" circle id="fab-upload">
        <i class="el-icon-upload2"></i>
      </el-button>

    </el-form>

    <!-- display data on this table -->
    <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
      <el-table-column v-for='item of tableHeader' :prop="item" :label="item" :key='item'>
      </el-table-column>
    </el-table>

    <div class="block">
      <el-pagination
        layout="prev, pager, next"
        :total="tableData.length">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { saveUpload } from '../../../api/results'
import UploadExcelComponent from '../../../components/UploadResults/index.vue'

var currentTime = new Date()

export default {
  name: 'ResultsUploadComponent',
  components: { UploadExcelComponent },
  data() {
    return {
      tableData: [],
      tableHeader: [],
      years: ['2018','2017','2016','2015','2014','2013'],
      examType: ['Cat-1', 'Mid-Term', 'Cat-2', 'End-Term'],
      resultsForm: {
        term: '',
        type: '',
        cls: '',
        teacher: '',
        year: currentTime.getFullYear()
      },
      resultsRules: {
          term: [
            { required: true, message: 'Please select the exam term', trigger: 'blur' }
          ],
          type: [
            { required: true, message: 'Please select the exam type', trigger: 'blur' }
          ],
          cls: [
            { required: true, message: 'Please select the class', trigger: 'change' }
          ],
          teacher: [
            { required: true, message: 'Please select the class teacher', trigger: 'change' }
          ],
          year: [
            { required: true, message: 'Please select the results year', trigger: 'change' }
          ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'school',
      'teachers',
      'classes'
    ])
  },
  methods: {
    openSucess() {
      this.$message({
        message: 'Successfuly Uploaded the results',
        type: 'success'
      })
    },
    openError(msg) {
      this.$message({
        message: `${msg}`,
        type: 'error'
      })
    },
    selected(data) {
      this.tableData = data.results
      this.tableHeader = data.header
    },
    getData(dataResults, resultsForm) {
      console.log(dataResults)
      console.log(resultsForm)
      // count to track when finished
      let count = 0

      this.$refs[resultsForm].validate(valid => {
        if (valid && dataResults.length !== 0) {
          // loop the excel data
          dataResults.forEach(row => {
            // set the class | teacher | school
            row.school = 0
            row.year = this.resultsForm.year
            row.term = this.resultsForm.term
            row.class = this.resultsForm.cls
            row.teacher = this.resultsForm.teacher

            // post results to the api
            saveUpload(row)
              .then(res => {
                count++ // increment by one on every loop

                // check if upload is finished
                if(count === dataResults.length){
                  // uloaded successuly
                  this.openSucess()

                  // empty the table
                  this.tableData = []
                  this.tableHeader = []

                  // TODO: navigate to list of reults
                }
              })
              .catch(err => {
                // error while uloading
                this.openError('Oops! Something went wrong while uploading! results')
              })
          })
        } else {
          // not valid
          console.log('form not valid!!')
          this.openError('Oops! fill all the fields and upload some results!')
        }
      })
    }
  }
}
</script>

<style>
  #fab-upload {
    float: right;
  }
</style>
